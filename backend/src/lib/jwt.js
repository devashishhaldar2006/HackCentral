import jwt from "jsonwebtoken";
import { ENV } from "./env.js";
import { getSafeUserData } from "./safeUser.js";
import { getCookieOptions, JWT_EXPIRY } from "./constants.js";

export const sendTokenResponse = (user, message, res) => {
  const token = jwt.sign({ _id: user._id, role: user.role }, ENV.JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
  });

  res.cookie("token", token, getCookieOptions());

  const safeUser = getSafeUserData(user);

  res.json({ success: true, message, data: safeUser });
};