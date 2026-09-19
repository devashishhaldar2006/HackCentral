import { ENV } from "./env.js";

/**
 * Validates whether an incoming HTTP/WebSocket request origin is permitted.
 * @param {string|undefined} origin
 * @param {function} callback
 */
export const checkAllowedOrigin = (origin, callback) => {
  // Allow non-browser requests (e.g. mobile apps, curl, server-to-server, health checks)
  if (!origin) {
    return callback(null, true);
  }

  // Parse custom origins from env
  const customOrigins = (ENV.ALLOWED_ORIGINS || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  const defaultProductionOrigins = [
    ENV.FRONTEND_URL,
    "https://hackcentral.me",
    "https://www.hackcentral.me",
    "https://hack-central.vercel.app",
    ...customOrigins,
  ].filter(Boolean);

  // In non-production environments, allow localhost/127.0.0.1
  const isDev = (ENV.NODE_ENV || "development") !== "production";
  if (isDev && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
    return callback(null, true);
  }

  // Exact match against explicit production allowlist
  if (defaultProductionOrigins.includes(origin)) {
    return callback(null, true);
  }

  // Strictly match only HackCentral Vercel preview domains if on development/staging (not arbitrary vercel apps)
  try {
    const parsed = new URL(origin);
    if (
      (parsed.hostname.startsWith("hackcentral-") || parsed.hostname.startsWith("hack-central-")) &&
      parsed.hostname.endsWith(".vercel.app")
    ) {
      return callback(null, true);
    }
  } catch {
    // Malformed origin
  }

  console.warn(`[CORS Blocked] Origin rejected: ${origin}`);
  callback(new Error(`Not allowed by CORS: ${origin}`));
};
