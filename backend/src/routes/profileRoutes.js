import express from "express";
import multer from "multer";
import {
  getProfile,
  editProfile,
  changePassword,
  changeAvatar,
  deleteAvatar,
} from "../controllers/profileController.js";
import { authProtect } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const profileRouter = express.Router();

// Wrap the multer upload so that errors (file too large, wrong type)
// are captured on req.multerError instead of crashing the request.
const handleUpload = (req, res, next) => {
  upload.single("avatar")(req, res, (err) => {
    if (err instanceof multer.MulterError || err) {
      req.multerError = err;
    }
    next();
  });
};

profileRouter.get("/me", authProtect, getProfile);
profileRouter.patch("/me/edit", authProtect, editProfile);
profileRouter.patch("/me/change-password", authProtect, changePassword);
profileRouter.patch("/me/upload-avatar", authProtect, handleUpload, changeAvatar);
profileRouter.delete("/me/avatar", authProtect, deleteAvatar);

export default profileRouter;
