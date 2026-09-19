import express from "express";
import rateLimit from "express-rate-limit";
import { evaluateProject, generatePitchDeck } from "../controllers/projectLabController.js";
import { authProtect } from "../middlewares/authMiddleware.js";

const projectLabRouter = express.Router();

// Strict rate-limiting for expensive AI endpoints (10 requests per 15 min per user/IP)
const aiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?._id?.toString() || req.ip,
  message: {
    success: false,
    message: "Too many AI requests. Please wait a few minutes before trying again.",
  },
});

projectLabRouter.post("/evaluate", authProtect, aiRateLimiter, evaluateProject);
projectLabRouter.post("/pitch-deck", authProtect, aiRateLimiter, generatePitchDeck);

export default projectLabRouter;