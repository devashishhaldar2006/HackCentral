import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { ENV } from "./env.js";
import { parseCookies } from "./utils.js";
import { checkAllowedOrigin } from "./cors.js";
import Event from "../models/Event.js";

let io;
const userSocketMap = new Map(); // userId -> Set of socketIds

// Helper to parse cookies from string

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: checkAllowedOrigin,
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

    // Join a specific event room with validation & authorization
    socket.on("join_event_room", async (eventId) => {
      try {
        if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
          return socket.emit("error", { message: "Invalid event ID for room" });
        }

        const event = await Event.findById(eventId).select("submittedBy participants status");
        if (!event) {
          return socket.emit("error", { message: "Event does not exist" });
        }

        const isOrganizer = event.submittedBy && event.submittedBy.toString() === socket.userId.toString();
        const isParticipant = event.participants?.some(
          (p) => p.user && p.user.toString() === socket.userId.toString()
        );

        // Allow organizer, participant, or public access if event is approved
        if (!isOrganizer && !isParticipant && event.status !== "approved") {
          return socket.emit("error", { message: "Unauthorized to join this event room" });
        }

        socket.join(`event_${eventId}`);
      } catch (err) {
        console.error("Error joining event room:", err);
        socket.emit("error", { message: "Failed to join event room" });
      }
    });

    // Leave a specific event room
    socket.on("leave_event_room", (eventId) => {
      if (eventId && mongoose.Types.ObjectId.isValid(eventId)) {
        socket.leave(`event_${eventId}`);
      }
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
