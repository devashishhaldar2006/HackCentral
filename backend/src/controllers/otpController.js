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

    if (!user || !user.password) {
      return res.status(200).json({ message: "If your email is registered with a password, you will receive an OTP." });
    }

    const now = Date.now();

    // 1. Cooldown check
    if (user.otpCooldown && user.otpCooldown > now) {
      const remainingSeconds = Math.ceil((user.otpCooldown - now) / 1000);
      return res.status(429).json({
        message: `Please wait ${remainingSeconds} seconds before requesting a new OTP.`,
      });
    }

    const originalCount = user.otpRequests?.count || 0;
    const isDifferentWindow =
      !user.otpRequests?.lastRequest ||
      now - user.otpRequests.lastRequest > RATE_LIMIT_WINDOW;
    const newCount = isDifferentWindow ? 1 : originalCount + 1;

    if (!isDifferentWindow && originalCount >= MAX_OTP_REQUESTS) {
      const updatedCooldown = now + RATE_LIMIT_WINDOW;
      await User.updateOne({ _id: user._id }, { $set: { otpCooldown: updatedCooldown } });
      return res.status(429).json({
        message: "Too many OTP requests. Please try again after an hour.",
      });
    }

    const otp = generateOTP();
    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");
    const expireTime = now + 5 * 60 * 1000; // 5 min
    const cooldownTime = now + COOLDOWN_PERIOD;

    // Atomic update to ensure only one concurrent request gets the slot
    const updatedUser = await User.findOneAndUpdate(
      {
        _id: user._id,
        $or: [
          { otpCooldown: { $lt: now } },
          { otpCooldown: { $exists: false } },
          { otpCooldown: null }
        ]
      },
      {
        $set: {
          otp: hashedOTP,
          otpExpire: expireTime,
          otpCooldown: cooldownTime,
          "otpRequests.count": newCount,
          "otpRequests.lastRequest": now,
        }
      },
      { new: true }
    );

    if (!updatedUser) {
       return res.status(429).json({
         message: "Please wait before requesting a new OTP.",
       });
    }

    const emailContent = getEmailContent(otp);

    try {
      await sendEmail({
        to: user.email,
        subject: "HackCentral - Your OTP Code",
        html: emailContent,
      });
    } catch (emailError) {
      // Rollback DB if email fails
      await User.updateOne(
        { _id: user._id },
        {
          $set: {
            otpCooldown: user.otpCooldown,
            "otpRequests.count": originalCount,
            "otpRequests.lastRequest": user.otpRequests?.lastRequest,
          }
        }
      );
      throw emailError;
    }

    res.status(200).json({ message: "If your email is registered with a password, you will receive an OTP." });
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

    const hashedOTP = crypto
      .createHash("sha256")
      .update(String(otp))
      .digest("hex");

    if (!user || user.otp !== hashedOTP || user.otpExpire < Date.now()) {
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
