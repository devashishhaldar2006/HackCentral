import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { runEventIngestion } from "../services/scrapers/ingestionEngine.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env safely from backend root
dotenv.config({ path: resolve(__dirname, "../../.env") });

async function main() {
  const uri = process.env.MONGO_DB_URI;
  if (!uri) {
    console.error("❌ Fatal Error: MONGO_DB_URI environment variable is not defined.");
    process.exit(1);
  }

  try {
    console.log("🔗 Connecting to MongoDB cluster securely...");
    await mongoose.connect(uri);
    console.log("✅ Successfully connected to MongoDB");

    const summary = await runEventIngestion();
    console.log("📊 Sync Summary:", JSON.stringify(summary, null, 2));

    await mongoose.disconnect();
    console.log("👋 Disconnected cleanly from MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("❌ Fatal error during event synchronization:", error);
    try {
      await mongoose.disconnect();
    } catch (_) {}
    process.exit(1);
  }
}

main();
