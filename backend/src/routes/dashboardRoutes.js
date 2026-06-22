import express from "express";
import { authProtect } from "../middlewares/authMiddleware.js";
import { getUserDashboard, getOrganizerDashboard } from "../controllers/dashboardController.js";

const dashboardRouter = express.Router();


dashboardRouter.get("/user", authProtect, getUserDashboard);
dashboardRouter.get("/organizer", authProtect, getOrganizerDashboard);

export default dashboardRouter;
