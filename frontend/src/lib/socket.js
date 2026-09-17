import { io } from "socket.io-client";

// In production (Vercel + Render), point to Render backend URL; in dev, defaults to empty string (Vite proxy)
const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || "";

export const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false, // We will manually connect in App.jsx when the user is authenticated
});

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

socket.on("connect_error", (err) => {
  console.error("Socket connect_error:", err.message);
});

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};
