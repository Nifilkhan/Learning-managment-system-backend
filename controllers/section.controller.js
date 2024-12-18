import Section from "../models/sectionSchema.js";
import Course from "../models/courseModel.js";
import { getCourseById, getSectionsByCourse } from "../services/section.service.js";

//adding section to a course

export const addSection = async (req, res) => {
  try {
    const { title } = req.body;
    const { courseId } = req.params;

    console.log("Received courseId:", courseId); // Debugging log

    // Validate courseId
    const course = await getCourseById(courseId);
    console.log(course);

    if (!course) {
      return res
        .status(404)
        .json({ message: "Course with given ID does not exist" });
    }
    const section = new Section({
      courseId,
      title: title.trim(),
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

//get section for a specific course by the courseId

export const getSection = async (req, res) => {
  try {
    const { courseId } = req.params;

    // console.log("section for the spepcific course based on the courseId", courseId);

    const course = await getCourseById(courseId);
    // console.log("course id found for get the specific course sections",course)

    if (!course) {
      return res
        .status(404)
        .json({ message: "Course with given ID does not exist" });
    }

    const sections = await getSectionsByCourse(courseId);
    console.log("sections for a course",sections)
    if (sections.length === 0) {
      return res
        .status(404)
        .json({ message: "No sections found for this course" });
    }

    res.status(200).json({ message: "Section found by course id", sections });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error while getting the course" });
  }
};

//delete the sections under the course one by one by passing the id it is easy to delete sections one by one

export const deleteSection = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await getCourseById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course id not found " });
    }

    const section = await Section.findOne({ courseId });
    if (!section || section.courseId.toString() !== courseId) {
      return res
        .status(404)
        .json({ message: "Section not found for this course" });
    }

    await deleteSection(section._id);
    res.status(200).json({ message: "Section deleted succesfully", section });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error occured while deleting the section" });
  }
};
