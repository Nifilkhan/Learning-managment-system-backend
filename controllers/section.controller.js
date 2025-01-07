import Section from "../models/sectionSchema.js";
import Course from "../models/courseModel.js";
import {
  getCourseById,
  getSectionsByCourse,
  softDeleteSection,
} from "../services/section.service.js";

//adding section to a course

export const addSection = async (req, res) => {
  try {
    const { title } = req.body;
    const { courseId } = req.params;

    // console.log('Received courseId:', courseId); // Debugging
    // console.log('Received title:', title); //

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
    course.section.push(section._id)
    // console.log('Saved section:', section);
    await course.save();

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

    const sections = await getSectionsByCourse({ courseId, isDeleted: false });
    res.status(200).json({ message: "Section found by course id", sections });
  } catch (error) {
    res.status(500).json({ message: "Error while getting the course" });
  }
};

//delete the sections under the course one by one by passing the id it is easy to delete sections one by one

export const deleteSection = async (req, res) => {
  try {
    const { courseId, sectionId } = req.params;
    // console.log('Received courseId:', courseId); // Debugging
    // console.log('Received sectionId:', sectionId); //

    const course = await getCourseById(courseId);

    if (!course) {
      // console.log("Course not found.");

      return res.status(404).json({ message: "Course id not found " });
    }

    const section = await softDeleteSection(courseId, sectionId);
    // console.log('Section found:', section);
    if (!section) {
      // console.log("Section not found for this course.");
      return res
        .status(404)
        .json({ message: "Section not found for this course" });
    }

    // console.log('Deleted section:', section);
    return res
      .status(200)
      .json({ message: "Section deleted succesfully", section });
  } catch (error) {
    // console.error('Error occurred in deleteSection:', error);
    res
      .status(500)
      .json({
        message: "Error occured while deleting the section",
        error: error.message,
      });
  }
};

export const editSection = async (req, res) => {
  try {
    const { courseId, sectionId } = req.params;
    const { title } = req.body;

    const course = await getCourseById(courseId);

    if (!course) {
      return res
        .status(404)
        .json({ message: "Course with given ID does not exist" });
    }

    const section = await Section.findOneAndUpdate(
      { _id: sectionId, courseId },
      { title: title.trim() },
      { new: true }
    );

    if (!section) {
      return res
        .status(404)
        .json({ message: "Section not found for this course" });
    }

    res.status(200).json({ message: "Section updated successfully", section });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error occurred while updating the section",
        error: error.message,
      });
  }
};
