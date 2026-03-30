import jwt from "jsonwebtoken";
import { ENV } from "./env.js";

export const sendTokenResponse = (user, message, res) => {
  const token = jwt.sign({ _id: user._id, role: user.role }, ENV.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: ENV.NODE_ENV === "production",
    sameSite: ENV.NODE_ENV === "production" ? "none" : "lax",
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.__v;

  res.json({ message, data: userObj });
};