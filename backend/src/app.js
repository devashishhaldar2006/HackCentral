import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./lib/db.js";
import { ENV } from "./lib/env.js";
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

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