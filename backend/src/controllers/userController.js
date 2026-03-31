import User from "../models/User.js";
import { getSafeUserData } from "../lib/safeUser.js";

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
    const { name, email } = req.body;
    user.name = name || user.name;
    user.email = email || user.email;
    await user.save();
    const safeUser = getSafeUserData(user);
    res.json({ message: "Profile updated successfully", data: safeUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile" });
  }
};
