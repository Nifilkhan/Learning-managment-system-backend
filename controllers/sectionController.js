import Section from "../models/sectionSchema.js";
import Course from "../models/courseModel.js";

export const addSection = async(req,res) => {
    try {
        const {title} = req.body;
        const {courseId} = req.params;

            // Validate courseId
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(400).json({ message: "Course not found" });
    }
        const section = new Section({
            courseId,
            title,
        })
        await section.save();
        res.status(200).json({message:'Section added succesfully',section})

    } catch (error) {
        res.status(500).json({message:'Internal error occured'})
    }
}