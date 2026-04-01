import express from "express";
import { authProtect } from "../middlewares/authMiddleware.js";
import { getUserEvents } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/events", authProtect, getUserEvents);

export default userRouter;
