import Course from "../models/courseModel.js";

export const validateCourseExists = async(req,res,next) => {
    try {
        const {courseId} = req.params;

        const course = await Course.findById(courseId);
        if(!course) {
            return res.status(404).json({message:'Course not found '});
        }
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

