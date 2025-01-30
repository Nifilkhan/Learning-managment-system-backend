import express from "express";
import { GetAllUsers, getUser, googleCallback, googleLogin, logout, signin, signup, verifyOtp, verifySession } from "../controllers/auth.controller.js";
import { authenticatedUser } from "../middleware/auth.middleware.js";
import Passport from "passport";


const router = express.Router();

router.post('/signup',signup)

router.post('/verify-otp',verifyOtp)

router.post('/signin',signin)

router.get('/get-verified-users',GetAllUsers)
router.get('/google',googleLogin)
router.get('/google/callback',Passport.authenticate('google',{failureRedirect:`${process.env.ERROR_URL}`}),googleCallback)
router.get('/verify-session',verifySession)

router.post('/logout',logout)
router.get('/user', authenticatedUser,getUser)

export default router;