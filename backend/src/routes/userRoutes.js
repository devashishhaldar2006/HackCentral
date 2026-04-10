import express from "express";
import { authProtect } from "../middlewares/authMiddleware.js";
import { getUserDashboard } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/dashboard", authProtect, getUserDashboard);

export default userRouter;
