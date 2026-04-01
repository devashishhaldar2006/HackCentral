import express from "express";
import mongoose from "mongoose";
import User from "../models/User.js";
import { getSafeUserData } from "../lib/safeUser.js";
import { validateProfileUpdateData } from "../lib/validate.js";

const profileRouter = express.Router();

const normalizeStringArray = (arr = []) =>
  arr.map((item) => item.trim()).filter(Boolean);

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const safeUser = getSafeUserData(user);
    res.json({ message: "User fetched successfully", data: safeUser });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user data" });
  }
};

export const editProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    validateProfileUpdateData(req);
    const {
      fullName,
      gender,
      avatar,
      college,
      location,
      skills,
      interests,
      github,
      linkedin,
      website,
    } = req.body;

    if (fullName !== undefined) user.fullName = fullName.trim();
    if (gender !== undefined) user.gender = gender;
    if (avatar !== undefined) user.avatar = avatar;
    if (college !== undefined) user.college = college.trim();
    if (location !== undefined) user.location = location.trim();

    if (skills !== undefined) user.skills = normalizeStringArray(skills);

    if (interests !== undefined)
      user.interests = normalizeStringArray(interests);

    if (github !== undefined) user.github = github;
    if (linkedin !== undefined) user.linkedin = linkedin;

    if (user.role === "organizer") {
      if (website !== undefined) user.website = website;
    }

    await user.save();
    const safeUser = getSafeUserData(user);
    res.json({ message: "Profile updated successfully", data: safeUser });
  } catch (error) {
    if (
      error.name === "ValidationError" ||
      error instanceof mongoose.Error.ValidationError
    ) {
      return res.status(400).json({ message: error.message });
    }

    if (
      error.name === "CastError" ||
      error instanceof mongoose.Error.CastError
    ) {
      return res.status(400).json({ message: "Invalid profile data" });
    }

    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }

    console.error("Profile update error:", error);
    res.status(500).json({ message: "Error updating profile" });
  }
};

export default profileRouter;
