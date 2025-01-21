import express from "express";
import { GetAllUsers, getUser, logout, signin, signup, verifyOtp } from "../controllers/auth.controller.js";
import { authenticatedUser } from "../middleware/auth.middleware.js";


const router = express.Router();

router.post('/signup',signup)

router.post('/verify-otp',verifyOtp)

router.post('/signin',signin)

router.get('/get-verified-users',GetAllUsers)

router.post('/logout',logout)
router.get('/user', authenticatedUser,getUser)

export default router;