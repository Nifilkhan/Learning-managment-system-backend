import mongoose from "mongoose"
import Cart from "../models/cart.schema.js"

export const addCartService = async(userId,courseId) => {
    try {
        if(!mongoose.Types.ObjectId.isValid(courseId)) {
            throw new Error('course id is not valid')
        }

        let cart = await Cart.findOne({userId: new mongoose.Types.ObjectId(userId)});
        console.log('cart from the service file add',cart);
        if(!cart) {
            cart = new Cart ({ userId: new mongoose.Types.ObjectId(userId), items: [new mongoose.Types.ObjectId(courseId)] });
        } else {
            if(cart.items.some(item => item.equals(new mongoose.Types.ObjectId(courseId)))) {
                throw new Error('course already in cart')
            }
            cart.items.push(new mongoose.Types.ObjectId(courseId));
        }

        await cart.save();
        return cart;
    } catch (error) {
        throw new Error(error.message)
    }
}

export const getCartItemsService = async(userId) => {
    try {
        const cart  = await Cart.findOne({userId}).populate('items');
        console.log('cart from the service file get',cart);
        return cart || {userId,items:[]};
    } catch (error) {
        throw new Error(error.message)
    }
}

export const removeFromCartSevice = async(userId,courseId) => {
    const cart = await Cart.findOneAndUpdate(
        {userId},
        {$pull:{items:courseId}},
        {new:true}
    ).populate("items");
    console.log('cart from the service file rm',cart)

    if(!cart) throw new Error('cart not found');
    return cart;
}