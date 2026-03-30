import { generateOTP } from "../lib/otp.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { validateSendOTPData, validateVerifyOTPData } from "../lib/validate.js";
import { sendEmail, getEmailContent } from "../lib/email.js";
import {
  COOLDOWN_PERIOD,
  RATE_LIMIT_WINDOW,
  MAX_OTP_REQUESTS,
} from "../lib/constants.js";
export const sendOTP = async (req, res) => {
  try {
    validateSendOTPData(req);
    const { email: rawEmail } = req.body;
    const email = rawEmail.toLowerCase();
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // block social users
    if (!user.password) {
      return res.status(400).json({
        message: `This account uses ${user.authProvider || "social"} sign-in. Password reset is not available.`,
      });
    }

    const now = Date.now();

    // 1. Cooldown check
    if (user.otpCooldown && user.otpCooldown > now) {
      const remainingSeconds = Math.ceil((user.otpCooldown - now) / 1000);
      return res.status(429).json({
        message: `Please wait ${remainingSeconds} seconds before requesting a new OTP.`,
      });
    }

    // 2. Rate limit check
    if (!user.otpRequests) {
      user.otpRequests = { count: 0, lastRequest: now };
    }

    const isDifferentWindow =
      !user.otpRequests.lastRequest ||
      now - user.otpRequests.lastRequest > RATE_LIMIT_WINDOW;
    if (isDifferentWindow) {
      user.otpRequests.count = 0;
    }

    if (user.otpRequests.count >= MAX_OTP_REQUESTS) {
      user.otpCooldown = now + RATE_LIMIT_WINDOW;
      await user.save();
      return res.status(429).json({
        message: "Too many OTP requests. Please try again after an hour.",
      });
    }

    const otp = generateOTP();
    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");
    user.otp = hashedOTP;
    user.otpExpire = now + 5 * 60 * 1000; // 5 min

    // update rate limits
    user.otpCooldown = now + COOLDOWN_PERIOD;
    user.otpRequests.count += 1;
    user.otpRequests.lastRequest = now;

    await user.save();

    const emailContent = getEmailContent(otp);

    await sendEmail({
      to: user.email,
      subject: "HackCentral - Your OTP Code",
      html: emailContent,
    });

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    const errorMsg = error?.message || "";
    const isValidation =
      errorMsg.includes("required") || errorMsg.includes("Invalid");
    if (isValidation) return res.status(400).json({ message: errorMsg });

    res.status(500).json({ message: "Error sending OTP", error: errorMsg });
  }
};

// VERIFY OTP + RESET PASSWORD
export const verifyOTPAndReset = async (req, res) => {
  try {
    validateVerifyOTPData(req);
    const { email: rawEmail, otp, newPassword } = req.body;
    const email = rawEmail.toLowerCase();

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const hashedOTP = crypto
      .createHash("sha256")
      .update(String(otp))
      .digest("hex");

    if (user.otp !== hashedOTP || user.otpExpire < Date.now()) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpire = undefined;
    user.otpCooldown = undefined;
    if (user.otpRequests) {
      user.otpRequests.count = 0;
    }

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    const errorMsg = error?.message || "";
    const isValidation =
      errorMsg.includes("required") ||
      errorMsg.includes("Invalid") ||
      errorMsg.includes("Password must");
    if (isValidation) return res.status(400).json({ message: errorMsg });

    res.status(500).json({ message: errorMsg });
  }
};
