import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./lib/db.js";
import { ENV } from "./lib/env.js";
import http from "http";
import { initializeSocket } from "./lib/socket.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow any localhost origin (5173, 5174, etc.), no-origin (Postman/server), or configured FRONTEND_URL
      if (
        !origin ||
        /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin) ||
        (ENV.FRONTEND_URL && origin === ENV.FRONTEND_URL)
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

import authRouter from "./routes/authRoutes.js";
import dashboardRouter from "./routes/dashboardRoutes.js";
import profileRouter from "./routes/profileRoutes.js";
import eventRouter from "./routes/eventRoutes.js";
import savedEventsRouter from "./routes/savedEventsRoutes.js";
import resourceRouter from "./routes/resourceRoutes.js";
import projectLabRouter from "./routes/projectLabRoutes.js";
import notificationRouter from "./routes/notificationRoutes.js";

app.use("/api/auth", authRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/profile", profileRouter);
app.use("/api/events", eventRouter);
app.use("/api/saved", savedEventsRouter);
app.use("/api/resources", resourceRouter);
app.use("/api/project-lab/", projectLabRouter);
app.use("/api/notifications", notificationRouter);


const startServer = async () => {
  try {
    await connectDB();
    const server = http.createServer(app);
    initializeSocket(server);
    server.listen(ENV.PORT || 3000, () => {
      console.log(`Server is running on port ${ENV.PORT || 3000}`);
    });
  } catch (error) {
    console.error("❌Error starting server:", error);
    process.exit(1);
  }
};
startServer();
