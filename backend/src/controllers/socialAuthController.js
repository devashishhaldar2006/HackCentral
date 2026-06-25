import User from "../models/User.js";
import admin from "../lib/firebaseAdmin.js";
import { sendTokenResponse } from "../lib/jwt.js";
import { DEFAULT_AVATAR } from "../lib/constants.js";

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
      // Update avatar if user has the default one and a social avatar is available
      if (picture && user.avatar === DEFAULT_AVATAR) {
        user.avatar = picture;
      }
      await user.save();
    } else {
      user = new User({
        fullName: name || email.split("@")[0],
        email,
        avatar: picture || DEFAULT_AVATAR,
        authProvider,
        role: (role === "organizer") ? "organizer" : "user",
      });
      await user.save();
    }

    sendTokenResponse(user, "Signed in successfully", res);
  } catch (error) {
    console.error("Social login error:", error);
    res.status(401).json({
      message: "Authentication failed. Please try again.",
    });
  }
};
