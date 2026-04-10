import bcrypt from "bcrypt";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import { getSafeUserData } from "../lib/safeUser.js";
import { DEFAULT_AVATAR } from "../lib/constants.js";
import { normalizeStringArray } from "../lib/utils.js";
import { handleError } from "../middlewares/errorHandler.js";
import {
  validateAvatarUpload,
  validatePasswordChangeData,
  validateProfileUpdateData,
} from "../lib/validate.js";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const safeUser = getSafeUserData(user);
    res.json({ message: "User fetched successfully", data: safeUser });
  } catch (error) {
    handleError(res, error, "Error fetching user data");
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
    handleError(res, error, "Error updating profile");
  }
};

export const changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.password || user.authProvider !== "local") {
      return res.status(400).json({
        message: `Password change is not available for ${user.authProvider} sign-in accounts`,
      });
    }

    validatePasswordChangeData(req);
    const { currentPassword, newPassword } = req.body;
  
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    handleError(res, error, "Error changing password");
  }
};

export const changeAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate the uploaded file
    validateAvatarUpload(req);

    // Delete old avatar from Cloudinary (if one exists)
    if (user.avatarPublicId) {
      try {
        await cloudinary.uploader.destroy(user.avatarPublicId);
      } catch (cloudErr) {
        console.error("Failed to delete old avatar from Cloudinary:", cloudErr);
        // Non-fatal — continue with the new upload
      }
    }

    user.avatar = req.file.path; // Cloudinary URL
    user.avatarPublicId = req.file.filename; // Needed to delete later

    await user.save();

    const safeUser = getSafeUserData(user);
    res.json({
      message: "Avatar uploaded successfully",
      data: safeUser,
    });
  } catch (error) {
    handleError(res, error, "Avatar upload failed");
  }
};

export const deleteAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete current avatar from Cloudinary if it exists
    if (user.avatarPublicId) {
      try {
        await cloudinary.uploader.destroy(user.avatarPublicId);
      } catch (cloudErr) {
        console.error("Failed to delete avatar from Cloudinary:", cloudErr);
      }
    }

    // Reset to default avatar
    user.avatar = DEFAULT_AVATAR;
    user.avatarPublicId = null;
    await user.save();

    const safeUser = getSafeUserData(user);
    res.json({
      message: "Avatar removed successfully",
      data: safeUser,
    });
  } catch (error) {
    handleError(res, error, "Error removing avatar");
  }
};
