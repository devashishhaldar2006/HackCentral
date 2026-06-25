import express from "express";
import { getEvents, getEventById, getEventCategories, submitEvent, editEvent, deleteEvent, getEventParticipants, registerForEvent } from "../controllers/eventController.js";
import { authProtect } from "../middlewares/authMiddleware.js";

const eventRouter = express.Router();

// Public routes — no auth needed
eventRouter.get("/", getEvents);
eventRouter.get("/categories", getEventCategories);
eventRouter.get("/:id", getEventById);

// Protected routes
eventRouter.post("/", authProtect, submitEvent);
eventRouter.put("/:id", authProtect, editEvent);
eventRouter.delete("/:id", authProtect, deleteEvent);
eventRouter.get("/:id/participants", authProtect, getEventParticipants);
eventRouter.post("/:id/register", authProtect, registerForEvent);

export default eventRouter;
