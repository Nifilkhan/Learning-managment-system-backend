import mongoose from "mongoose";

export const cartSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
       { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  ],
});

const Cart = mongoose.model("Cart",cartSchema);
export default Cart;
