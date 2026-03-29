import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validateSignUpData, validateSignInData } from "../lib/validate.js";
import { ENV } from "../lib/env.js";

const sendTokenResponse = (user, message, res) => {
  const token = jwt.sign({ _id: user._id, role: user.role }, ENV.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.__v;

  res.json({ message, data: userObj });
};

export const signup = async (req, res) => {
  try {
    validateSignUpData(req);
    const { fullName, email, password, role } = req.body;
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
    // Distinguish validation errors from server errors
    const isValidation =
      error.message.includes("required") ||
      error.message.includes("Password must") ||
      error.message.includes("Invalid") ||
      error.name === "ValidationError";

    const status = isValidation ? 400 : 500;
    res.status(status).json({ message: error.message });
  }
};

export const signin = async (req, res) => {
  try {
    validateSignInData(req);
    const { email, password, role } = req.body;
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
    const isValidation =
      error.message.includes("required") ||
      error.message.includes("Invalid") ||
      error.message.includes("Password must");

    const status = isValidation ? 400 : 500;
    res.status(status).json({ message: error.message });
  }
};

export const signout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    res.json({ message: "User signed out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error occurred while signing out." });
  }
};
