import express from "express";
import { addCart } from "../controllers/cart.controller.js";
import { authenticatedUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post('/add-to-cart',authenticatedUser,addCart)

export default router;