// Use environment variable VITE_API_URL for production; defaults to /api for Vite dev proxy
const apiUrl = import.meta.env.VITE_API_URL || "/api";
export const BASE_URL = apiUrl.endsWith("/") ? apiUrl.slice(0, -1) : apiUrl;

export const DEFAULT_AVATAR =
  "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg?w=1480";