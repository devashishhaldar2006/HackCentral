import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./lib/db.js";
import { ENV } from "./lib/env.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow any localhost origin (5173, 5174, etc.) and no-origin (Postman/server)
      if (!origin || /^http:\/\/localhost:\d+$/.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
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

app.use("/api/auth", authRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/profile", profileRouter);
app.use("/api/events", eventRouter);
app.use("/api/saved", savedEventsRouter);
app.use("/api/resources", resourceRouter);
app.use("/api/project-lab/", projectLabRouter);


const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT || 3000, () => {
      console.log(`Server is running on port ${ENV.PORT || 3000}`);
    });
  } catch (error) {
    console.error("❌Error starting server:", error);
    process.exit(1);
  }
};
startServer();
