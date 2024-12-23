import Section from "../models/sectionSchema.js";
import Course from "../models/courseModel.js";
import { getCourseById, getSectionsByCourse, softDeleteSection } from "../services/section.service.js";

//adding section to a course

export const addSection = async (req, res) => {
  try {
    const { title } = req.body;
    const { courseId } = req.params;

    // Validate courseId
    const course = await getCourseById(courseId);

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
  } catch (error) {
        res
      .status(500)
      .json({ message: "Internal error occured", error: error.message });
  }
};

//get section for a specific course by the courseId

export const getSection = async (req, res) => {
  try {
    const { courseId } = req.params;


    const course = await getCourseById(courseId);

    if (!course) {
      return res
        .status(404)
        .json({ message: "Course with given ID does not exist" });
    }

    const sections = await getSectionsByCourse({courseId,isDeleted:false});
    res.status(200).json({ message: "Section found by course id", sections });
  } catch (error) {
    res.status(500).json({ message: "Error while getting the course" });
  }
};

//delete the sections under the course one by one by passing the id it is easy to delete sections one by one

export const deleteSection = async (req, res) => {
  try {
    const { courseId,sectionId } = req.params;

    const course = await getCourseById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course id not found " });
    }

    const section = await softDeleteSection(courseId,sectionId);
    if (!section) {
      return res
        .status(404)
        .json({ message: "Section not found for this course" });
    }

    return res.status(200).json({ message: "Section deleted succesfully", section });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error occured while deleting the section" });
  }
};
