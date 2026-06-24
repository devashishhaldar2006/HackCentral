import { GoogleGenAI } from "@google/genai";
import { ENV } from "./env.js";

if (!ENV.GEMINI_API_KEY) {
  throw new Error("CRITICAL ERROR: GEMINI_API_KEY is missing from environment variables.");
}

const ai = new GoogleGenAI({
  apiKey: ENV.GEMINI_API_KEY,
});

export default ai;