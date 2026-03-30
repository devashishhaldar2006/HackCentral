import express from "express";
import { signup, signin, signout} from "../controllers/authController.js";
import { socialLogin } from "../controllers/socialAuthController.js";
import { sendOTP, verifyOTPAndReset } from "../controllers/otpController.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/signin", signin);
authRouter.post("/signout", signout);
authRouter.post("/social-login", socialLogin);

// 🔐 OTP BASED RESET PASSWORD
authRouter.post("/send-otp", sendOTP);
authRouter.post("/verify-otp", verifyOTPAndReset);

export default authRouter;

