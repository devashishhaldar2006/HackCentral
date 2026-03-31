import express from "express";
import { editProfile, getProfile } from "../controllers/userController.js";
import { authProtect } from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.get("/profile", authProtect, getProfile);
userRouter.patch("/profile/edit", authProtect, editProfile);

export default userRouter;
