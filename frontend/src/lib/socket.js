import { io } from "socket.io-client";

// Use empty string to connect to the same origin (handled by Vite proxy)
const SOCKET_URL = "";

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
