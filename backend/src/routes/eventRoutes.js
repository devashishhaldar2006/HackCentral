import express from "express";
import { getEvents, getEventById, getEventCategories } from "../controllers/eventController.js";

const eventRouter = express.Router();

// Public routes — no auth needed
eventRouter.get("/", getEvents);
eventRouter.get("/categories", getEventCategories);
eventRouter.get("/:id", getEventById);

export default eventRouter;
