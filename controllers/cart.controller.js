import mongoose from "mongoose";
import Cart from "../models/cart.schema.js";
import User from "../models/userModel.js";
import { addCartService, getCartItemsService, removeFromCartSevice } from "../services/cart.service.js";


export const addCart = async(req,res) => {
    console.log('request value from add to cart',req.body);
    const {courseId} = req.body;
    const userId = req.userId;

    try {
        console.log('user id from request',userId);
        console.log('course id from the request',courseId)

        if(!userId || !courseId) {
            console.log('dfasghdfg')
            return res.status(500).json({message:'user id or course id is not found'})
        }

        const cart = await addCartService(userId,courseId);
        console.log('from the controller',cart)
        res.status(200).json({message:'Cart added successfully',cart})
    } catch (error) {
        res.status(500).json({message:'internal error occured while adding item in cart'})
    }
}

export const getCartItems = async(req,res) => {
    try {
        const cart = await getCartItemsService(req.userId);
        // console.log('cart items from get api',cart)
        console.log('cart from the controller',cart)

        if(!cart) {
            return res.status(401).json({message:'No items found in the cart'})
        }

        res.status(200).json({message:'items from the cart',cart})
    } catch (error) {
        res.status(500).json({message:'internal error occured while getting the cart items'})
    }
}

export const removeCourse = async(req,res) => {
    try {

        const removeCourse = await removeFromCartSevice(req.userId,req.params.courseId);
        console.log('remove course controller',removeCourse)
        res.status(200).json({message:'cart item removed succesfully',removeCourse});
        
    } catch (error) {
        res.status(500).json({message:'internal error occured while removing the course'})
    }
}
