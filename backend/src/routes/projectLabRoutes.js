import express from "express";
import { evaluateProject, generatePitchDeck } from "../controllers/projectLabController.js";
import { authProtect } from "../middlewares/authMiddleware.js";

const projectLabRouter = express.Router();

projectLabRouter.post("/evaluate", authProtect, evaluateProject);
projectLabRouter.post("/pitch-deck", authProtect, generatePitchDeck);

export default projectLabRouter;