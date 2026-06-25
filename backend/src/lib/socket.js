import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { ENV } from "./env.js";
import { parseCookies } from "./utils.js";

let io;
const userSocketMap = new Map(); // userId -> socketId

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
    console.log(`Socket connected: ${socket.id} (User: ${socket.userId})`);
    
    // Track user socket
    userSocketMap.set(socket.userId, socket.id);

    // Join a specific event room
    socket.on("join_event_room", (eventId) => {
      socket.join(`event_${eventId}`);
      console.log(`User ${socket.userId} joined room event_${eventId}`);
    });

    // Leave a specific event room
    socket.on("leave_event_room", (eventId) => {
      socket.leave(`event_${eventId}`);
      console.log(`User ${socket.userId} left room event_${eventId}`);
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id} (User: ${socket.userId})`);
      userSocketMap.delete(socket.userId);
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
  return userSocketMap.get(userId.toString());
};
