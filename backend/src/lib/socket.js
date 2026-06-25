import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { ENV } from "./env.js";
import { parseCookies } from "./utils.js";

let io;
const userSocketMap = new Map(); // userId -> Set of socketIds

// Helper to parse cookies from string

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        if (!origin || /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    },
  });

  // Authentication Middleware
  io.use((socket, next) => {
    try {
      const cookies = parseCookies(socket.request.headers.cookie);
      const token = cookies.token;

      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      const decoded = jwt.verify(token, ENV.JWT_SECRET);
      socket.userId = decoded._id;
      next();
    } catch (error) {
      console.error("Socket authentication error:", error.message);
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    // Track user socket
    if (!userSocketMap.has(socket.userId)) {
      userSocketMap.set(socket.userId, new Set());
    }
    userSocketMap.get(socket.userId).add(socket.id);

    // Join a specific event room
    socket.on("join_event_room", (eventId) => {
      socket.join(`event_${eventId}`);
    });
    // Leave a specific event room
    socket.on("leave_event_room", (eventId) => {
      socket.leave(`event_${eventId}`);
    });
    socket.on("disconnect", () => {
      const userSockets = userSocketMap.get(socket.userId);
      if (userSockets) {
        userSockets.delete(socket.id);
        if (userSockets.size === 0) {
          userSocketMap.delete(socket.userId);
        }
      }
    });
  });

  return io;
};

// Export utility functions to emit events from controllers
export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

export const getSocketIdForUser = (userId) => {
  const sockets = userSocketMap.get(userId.toString());
  return sockets ? Array.from(sockets) : [];
};
