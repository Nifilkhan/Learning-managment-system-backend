import express from "express";
import { GetAllUsers, signin, signup, verifyOtp } from "../controllers/authController.js";


const router = express.Router();

router.post('/signup',signup)

router.post('/verify-otp',verifyOtp)

router.post('/signin',signin)

router.get('/get-verified-users',GetAllUsers)

export default router;