import { GoogleGenAI } from "@google/genai";
import { ENV } from "./env.js";

const ai = new GoogleGenAI({
  apiKey: ENV.GEMINI_API_KEY,
});

export default ai;