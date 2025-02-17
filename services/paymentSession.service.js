import Stripe from "stripe";
import Course from "../models/courseModel.js";
import mongoose from "mongoose";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
export const paymentSessionService = async(userId,courseId) => {
    console.log('first thing that i have logged',courseId)
     // Check if courseId is a valid MongoDB ObjectId
     if (!mongoose.Types.ObjectId.isValid(courseId)) {
        console.error("Invalid Course ID format:", courseId);
        throw new Error("Invalid Course ID format");
    }
    try {
        const course = await Course.findById(courseId);
        console.log('from payment session service',course)

        const session = await stripe.checkout.sessions.create({
            payment_method_types:["card"],
            line_items: [
                {
                    price_data:{
                        currency:"usd",
                        product_data:{name:course.title},
                        unit_amount:course.price * 100,
                    },
                    quantity:1,
                }
            ],
            mode:"payment",
            success_url:`${process.env.FRONTEND_URL}home/my-learning?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url:`${process.env.FRONTEND_URL}home/courses`,
            metadata:{ userId,courseId }
        })

        console.log('from payment session service ,session variable',session)
        return session.id;
    } catch (error) {
          console.error("Error creating Stripe session:", error);
        throw new Error("Internal server error in payment session");
    }
}