import { paymentConfirm, paymentSessionService } from "../services/paymentSession.service.js";

export const createSession = async(req,res) => {
    try {
        // console.log('from controller',req.body)
        const {courseIds} = req.body;
        console.log('from controller courseId',courseIds)
        const userId = req.userId;
        if(!Array.isArray(courseIds) || courseIds.length === 0) {
            return res.status(400).json({message:'Invalid course selection'})
        }
        const sessionId = await paymentSessionService(userId,courseIds);
        res.status(200).json({sessionId, message: "Payment session created successfully"});
    } catch (error) {
        console.error("Error creating session:", error);
        res.status(500).json({ error: "Payment session failed" });
    }
}


export const verifyPayment = async(req,res) => {
    try {
        const {sessionId} = req.params;

        if(!sessionId) {
            return res.status(400).json({ message: "Session ID is required" });
        }
        const result = await paymentConfirm(sessionId);
        console.log('verificaction result from the verify payment controller',result)
        if (result.success === true) {
            return res.status(200).json({ message: "Payment verified & courses unlocked successfully" });
        } else if(result.success === false) {
            return res.status(400).json({ message: "Payment verification failed" });
        }
    } catch (error) {
        res.status(500).json({message:'internal error occured while verifying the payment'})
    }
}