import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validateSignUpData, validateSignInData } from "../lib/validate.js";
import { ENV } from "../lib/env.js";

export const signup = async (req, res) => {
  try {
    validateSignUpData(req);
    const { fullName, email, password, role } = req.body;
    // Add your signup logic here
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      fullName,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    const savedUser = await user.save();
    const token = await jwt.sign(
      { _id: savedUser._id, role: savedUser.role },
      ENV.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    res.json({
      message: "User signed up successfully",
      data: savedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Error occurred while signing up user: " + error.message });
  }
};

export const signin = async (req, res) => {
  try {
    validateSignInData(req);
    const { email, password, role } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    if (role && user.role !== role) {
      throw new Error("Invalid role for this user");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }
    const token = await jwt.sign({ _id: user._id, role: user.role }, ENV.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    res.json({
      message: "User signed in successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: "Error occurred while signing in user: " + error.message });
  }
};

export const signout = (req, res) => {
  try {
    res.clearCookie("token");
    res.json({
      message: "User signed out successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Error occurred while signing out user" });
  }
};
