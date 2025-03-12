import express from "express";
import { createSession, verifyPayment } from "../controllers/payment.controller.js";
import { authenticatedUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post('/create-checkout-session',authenticatedUser,createSession);
router.post('/payment-confirmation/:sessionId',authenticatedUser,verifyPayment);

export default router;