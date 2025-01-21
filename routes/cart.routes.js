import express from "express";
import { addCart } from "../controllers/cart.controller.js";

const router = express.Router();

router.post('/add-to-cart',addCart)

export default router;