import express from "express";
import { getNotifications, markAsRead } from "../controllers/notificationController.js";
import { authProtect } from "../middlewares/authMiddleware.js";

const notificationRouter = express.Router();

notificationRouter.get("/", authProtect, getNotifications);
notificationRouter.put("/:id/read", authProtect, markAsRead);

export default notificationRouter;
