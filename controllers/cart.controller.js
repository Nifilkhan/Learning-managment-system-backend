import Cart from "../models/cart.schema.js";
import User from "../models/userModel.js";


export const addCart = async(req,res) => {
    const {userId,courseId} = req.body;
    try {
        let cart = await User.findOne({userId});
        console.log('cart variable data:',cart)

        if(!cart) {
            cart = new Cart({userId,items:[courseId]})
        }else {
            return res.status(400).json({ message: "Course already in cart" });
        }
        await cart.save();
        console.log('saved cart data:',cart)
        res.status(200).json({message:'Cart added successfully',cart})
    } catch (error) {
        res.status(500).json({message:'internal error occured while adding item in cart'})
    }
}