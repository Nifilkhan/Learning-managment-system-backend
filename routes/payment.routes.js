import express from "express";
import { createSession } from "../controllers/payment.controller.js";
import { authenticatedUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post('/create-checkout-session',authenticatedUser,createSession);

export default router;