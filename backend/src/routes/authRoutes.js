import express from "express";
import { signup, signin, signout } from "../controllers/authController.js";
import { socialLogin } from "../controllers/socialAuthController.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/signin", signin);
authRouter.post("/signout", signout);
authRouter.post("/social-login", socialLogin);

export default authRouter;

