import mongoose from "mongoose";
import { ENV } from "./env.js";
const connectDB = async () => {
  try {
    if (!ENV.MONGO_DB_URI) {
      throw new Error("✅MONGO_DB_URI is not defined in environment variables");
    }
    const conn = await mongoose.connect(ENV.MONGO_DB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
