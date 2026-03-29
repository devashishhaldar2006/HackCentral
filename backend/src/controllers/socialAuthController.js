import User from "../models/User.js";
import jwt from "jsonwebtoken";
import admin from "../lib/firebaseAdmin.js";
import { ENV } from "../lib/env.js";

export const socialLogin = async (req, res) => {
  try {
    const { idToken, role } = req.body;
    if (!idToken) {
      return res.status(400).json({ message: "Firebase ID token is required." });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email, name, picture, firebase } = decodedToken;

    if (!email) {
      return res.status(400).json({ message: "Email is required for authentication." });
    }

    const providerData = firebase?.sign_in_provider || "unknown";
    let authProvider = "local";
    if (providerData === "google.com") authProvider = "google";
    else if (providerData === "github.com") authProvider = "github";

    let user = await User.findOne({ email });

    if (user) {
      // Upgrade local account to social, and update avatar if user still has default
      if (user.authProvider === "local" && authProvider !== "local") {
        user.authProvider = authProvider;
      }
      // Update avatar if user has the default freepik one and a social avatar is available
      if (picture && user.avatar?.includes("freepik")) {
        user.avatar = picture;
      }
      await user.save();
    } else {
      user = new User({
        fullName: name || email.split("@")[0],
        email,
        avatar:
          picture ||
          "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg?w=1480",
        authProvider,
        role: role || "user",
      });
      await user.save();
    }

    const token = jwt.sign({ _id: user._id, role: user.role }, ENV.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // Strip sensitive fields
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.__v;

    res.json({
      message: "Signed in successfully",
      data: userObj,
    });
  } catch (error) {
    console.error("Social login error:", error);
    res.status(401).json({
      message: "Authentication failed. Please try again.",
    });
  }
};
