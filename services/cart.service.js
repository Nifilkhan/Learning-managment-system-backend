import Cart from "../models/cart.schema.js"

export const removeFromCartSevice = async(userId,courseId) => {
    const cart = await Cart.findOneAndUpdate(
        {userId},
        {$pull:{items:courseId}},
        {new:true}
    ).populate("items");
    console.log('cart from the service file',cart)

    if(!cart) throw new Error('cart not found');
    return cart;
}