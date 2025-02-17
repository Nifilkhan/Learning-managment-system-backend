import { paymentSessionService } from "../services/paymentSession.service.js";

export const createSession = async(req,res) => {
    try {
        // console.log('from controller',req.body)
        const {courseId} = req.body;
        console.log('from controller courseId',courseId)
        const userId = req.userId;
        const sessionId = await paymentSessionService(userId,courseId);
        res.status(200).json({sessionId});
    } catch (error) {
        console.error("Error creating session:", error);
        res.status(500).json({ error: "Payment session failed" });
    }
}