import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";

export const authProtect = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Unauthorized Access - Login Please");
    }
    const decoded = await jwt.verify(token, ENV.JWT_SECRET);
    if (!decoded) {
      throw new Error("Unauthorized Access - Invalid Token");
    }
    const user = await User.findById(decoded._id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    res
      .status(401)
      .json({ message: "Authentication Failed: " + error.message });
  }
};
