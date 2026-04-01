// Use environment variable VITE_API_URL for production; defaults to /api for Vite dev proxy
const apiUrl = import.meta.env.VITE_API_URL || "/api";
export const BASE_URL = apiUrl.endsWith("/") ? apiUrl.slice(0, -1) : apiUrl;
