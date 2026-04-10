import { ENV } from "./env.js";

export const DEFAULT_AVATAR =
  "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg?w=1480";

export const COOLDOWN_PERIOD = 60 * 1000; // 60 seconds between OTP requests
export const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1-hour sliding window
export const MAX_OTP_REQUESTS = 3; // max OTPs per window

export const getCookieOptions = (maxAgeMs = 7 * 24 * 60 * 60 * 1000) => ({
  httpOnly: true,
  secure: ENV.NODE_ENV === "production",
  sameSite: ENV.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
  expires: new Date(Date.now() + maxAgeMs),
});

export const JWT_EXPIRY = "7d";
export const JWT_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

export const ROLES = ["user", "organizer"];