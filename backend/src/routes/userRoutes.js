import express from "express";
import { getMe } from "../controllers/userController.js";
import { authProtect } from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.get("/me", authProtect, getMe);

export default userRouter;