import User from "../models/User.js";
import bcrypt from "bcrypt";
import { sendTokenResponse } from "../lib/jwt.js";
import { validateSignUpData, validateSignInData } from "../lib/validate.js";
import { getCookieOptions } from "../lib/constants.js";
import { handleError } from "../middlewares/errorHandler.js";

export const signup = async (req, res) => {
  try {
    validateSignUpData(req);
    const { fullName, email: rawEmail, password, role } = req.body;
    const email = rawEmail.toLowerCase();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "An account with this email already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      fullName,
      email,
      password: hashedPassword,
      role: role || "user",
    });
    const savedUser = await user.save();
    sendTokenResponse(savedUser, "User signed up successfully", res);
  } catch (error) {
    handleError(res, error, "Error signing up");
  }
};

export const signin = async (req, res) => {
  try {
    validateSignInData(req);
    const { email: rawEmail, password, role } = req.body;
    const email = rawEmail.toLowerCase();
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }
    // Guard: social-login users don't have a password
    if (!user.password) {
      return res.status(400).json({
        message: `This account uses ${user.authProvider} sign-in. Please use the ${user.authProvider} button to log in.`,
      });
    }

    if (role && user.role !== role) {
      return res.status(403).json({ message: "Invalid role for this user." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    sendTokenResponse(user, "User signed in successfully", res);
  } catch (error) {
    handleError(res, error, "Error signing in");
  }
};

export const signout = (req, res) => {
  try {
    // Using the same cookie options (minus expires) to ensure the browser clears it
    const opts = getCookieOptions(0);
    delete opts.expires;
    res.clearCookie("token", opts);
    res.json({ message: "User signed out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error occurred while signing out." });
  }
};
