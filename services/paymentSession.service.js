import Stripe from "stripe";
import Course from "../models/courseModel.js";
import mongoose from "mongoose";
import Purchase from "../models/payment.model.js";
import Enrollment from "../models/enrollment.schema.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
export const paymentSessionService = async(userId,courseIds) => {
    console.log('first thing that i have logged',courseIds)
     // Check if courseId is a valid MongoDB ObjectId
     if (!Array.isArray(courseIds) || !courseIds.every(id => mongoose.Types.ObjectId.isValid(id))) {
        console.error("Invalid Course ID format:", courseIds);
        throw new Error("Invalid Course ID format");
    }
    try {
        const course = await Course.find({ _id: { $in:courseIds}});
        console.log('from payment session service',course);

        if(!course||course.length === 0) {
           throw new Error('Course not found') 
        }

        const lineItems = course.map(course => ({
            price_data:{
                currency:"usd",
                product_data:{name:course.title},
                unit_amount:course.price * 100,
            },
            quantity:1,
    }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types:["card"],
            line_items: lineItems,
            mode:"payment",
            success_url:`${process.env.FRONTEND_URL}home/payment-verify?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url:`${process.env.FRONTEND_URL}home/courses`,
            metadata:{ userId,courseIds:JSON.stringify(courseIds) }
        })

        // console.log('from payment session service ,session variable',session)

        await Purchase.create({userId,courseId:courseIds,paymentId:session.id, status:'pending'});
        return session.id;
    } catch (error) {
          console.error("Error creating Stripe session:", error);
        throw new Error("Internal server error in payment session");
    }
}




export const paymentConfirm = async(sessionId) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (!session || session.payment_status !== 'paid'){
            throw new Error('Payment not completed');   
        }

        if(session.payment_status === 'paid') {
            const userId = session.metadata.userId;
            const courseIds = JSON.parse(session.metadata.courseIds || '[]');
    
            await Enrollment.findOneAndUpdate(
                {userId},
                {$addToSet:{purchasedCourses:{$each:courseIds}}},
                {upsert:true,new:true}
            )
    
            await Purchase.updateMany({paymentId:sessionId},{status:'success'});
            return {success:true,message: "Payment confirmed. Courses unlocked!"};
        } else {
            return {success:false}
        }
    } catch (error) {
        console.log('Error confirming payment:',error);
        throw new Error('Internal server error in payment confirmation');
    }
}