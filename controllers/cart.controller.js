import mongoose from "mongoose";
import Cart from "../models/cart.schema.js";
import User from "../models/userModel.js";
import { removeFromCartSevice } from "../services/cart.service.js";


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

        console.log('request body value which recived',req.body);
        let cart = await Cart.findOne({userId: new mongoose.Types.ObjectId(userId)});
        console.log('cart variable data:',cart)

        if(!cart) {
            cart = new Cart({userId: new mongoose.Types.ObjectId(userId),items:[courseId]})
        }else {
            if (cart.items.includes(courseId)) {
                return res.status(400).json({ message: "Course already in cart" });
              }
              cart.items.push(courseId);
        }
        await cart.save();
        console.log('saved cart data:',cart)
        res.status(200).json({message:'Cart added successfully',cart})
    } catch (error) {
        res.status(500).json({message:'internal error occured while adding item in cart'})
    }
}

export const getCartItems = async(req,res) => {
    try {
        const userId = req.userId;
        const cart = await Cart.findOne({userId}).populate('items');
        // console.log('cart items from get api',cart)

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
