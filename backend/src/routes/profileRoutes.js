import express from "express";
import { getProfile, editProfile } from "../controllers/profileController.js";
import { authProtect } from "../middlewares/authMiddleware.js";
const profileRouter = express.Router();

profileRouter.get("/me", authProtect, getProfile);
profileRouter.patch("/me/edit", authProtect, editProfile);

export default profileRouter;