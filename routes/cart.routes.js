import express from "express";
import { addCart, getCartItems, removeCourse } from "../controllers/cart.controller.js";
import { authenticatedUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post('/add-to-cart',authenticatedUser,addCart)
router.get('/cart-items',authenticatedUser,getCartItems)
router.delete('/remove-course/:courseId',authenticatedUser,removeCourse)

export default router;