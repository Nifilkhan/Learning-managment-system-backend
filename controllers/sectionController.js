import Section from "../models/sectionSchema.js";
import Course from "../models/courseModel.js";

export const addSection = async (req, res) => {
  try {
    const { title } = req.body;
    const { courseId } = req.params;

    console.log("Received courseId:", courseId); // Debugging log

    // Validate courseId
    const course = await Course.findById(courseId);
    console.log(course);

    if (!course) {
      return res.status(400).json({ message: "Course not found" });
    }
    const section = new Section({
      courseId,
      title,
    });
    await section.save();
    res.status(200).json({ message: "Section added succesfully", section });
    console.log(section);
    
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal error occured", error: error.message });
  }
};
