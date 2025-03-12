import { purchasedCourseService } from "../services/purchaedCourse.service.js"

export const purchasedCourse = async(req,res) => {
    try {
        const userId = req.userId;
        const purchased = await purchasedCourseService(userId);

        if(!purchased || purchased.length === 0) {
            return res.status(401).json({message:'NO courses found for this user'})
        }

        res.status(200).json({message:'purchased courses list',purchased})
    } catch (error) {
        res.status(500).json({message:'error occured while getting the purchased course'})
    }
}