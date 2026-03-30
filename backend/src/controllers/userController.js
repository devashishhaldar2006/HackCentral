import User from "../models/User.js";

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.__v;
    res.json({ message: "User fetched successfully", data: userObj });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user data" });
  }
};