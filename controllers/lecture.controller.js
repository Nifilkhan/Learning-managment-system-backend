import Lecture from "../models/lectureSchema.js";
import {
  addLectureToSection,
  editLectureService,
  getLectureService,
  softDeleteLecture,
} from "../services/lecture.service.js";
import { generatePresignedUrl } from "../config/uploads.js";
import Course from "../models/courseModel.js";
import User from "../models/userModel.js";
import Section from "../models/sectionSchema.js";
import Enrollment from "../models/enrollment.schema.js";

export const getPreSignedUrl = async (req, res) => {
  try {
    const { fileName, fileType, fileCategory } = req.query;
    // console.log('File name:',fileName);
    // console.log('File type:',fileType);
    // console.log('file category',fileCategory)

    if (!fileName || !fileType) {
      return res
        .status(400)
        .json({
          message: "File name, type,file category and courseId are required",
        });
    }

    const { preSignedUrl, videoUrl } = await generatePresignedUrl(
      fileName,
      fileType
    );
    // console.log(preSignedUrl, "presigned url");

    res.status(200).json({ preSignedUrl, videoUrl });
  } catch (error) {
    console.error("Error while generating presigned URL:", error);
    res.status(500).json({
      message: "internal error occured while getting the presigned url",
    });
  }
};

export const addLecture = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const { title, contentType, videoUrl, articleContent, descripiton } =
      req.body;
    // console.log(req.body);

    // console.log("Received request to add lecture with data:", req.body);

    const newLecture = new Lecture({
      title,
      contentType,
      videoUrl,
      articleContent,
      descripiton,
      sectionId,
    });
    if (!sectionId) {
      return res.status(400).json({ message: "Section ID is required" });
    }
    const savedLecture = await newLecture.save();

    const updateSection = await addLectureToSection(
      sectionId,
      savedLecture._id
    );
    // console.log('update section in the controller',updateSection)

    res
      .status(200)
      .json({
        message: "Lecture added succesfully",
        savedLecture,
        updateSection,
      });
  } catch (error) {
    console.error("Error occurred while adding the lecture:", error);
    res.status(500).json({ message: "Error occured while adding the lecture" });
  }
};

export const editLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const { title, contentType, videoUrl, articleContent } = req.body;
    console.log("Received request to edit lecture with data:", req.body);

    const updatedLecture = await editLectureService(lectureId, {
      title,
      contentType,
      videoUrl,
      articleContent,
    });

    if (!updatedLecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    res
      .status(200)
      .json({ message: "Lecture edited successfully", updatedLecture });
  } catch (error) {
    throw new error("Error occured while editing the lecture");
  }
};

export const getLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;

    const lecture = await getLectureService(lectureId);

    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    res.status(200).json({ message: "Lecture Found", lecture });
  } catch (error) {
    throw new error("Error while getting the lecture");
  }
};

export const getLectures = async (req, res) => {
  try {
    console.log("Received userId:", req.userId); // ✅ Debugging log
    const userId = req.userId;
    const { sectionId } = req.params;

    if (!sectionId) {
      return res.status(400).json({ message: "Section ID is required" });
    }

    const lectures = await Lecture.find({ sectionId });
    if (!lectures.length) {
      return res.status(404).json({ message: "No lectures found" });
    }

    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    const courseId = section.courseId;

    console.log("Fetching enrollment for userId:", userId); // ✅ Debugging log
    const enrollment = await Enrollment.findOne({ userId });

    console.log("Enrollment data:", enrollment); // ✅ Debugging log

    let hasPurchased = false;
    if (enrollment) {
      console.log("User has no purchased courses or enrollment not found.");

      hasPurchased = enrollment.purchasedCourses
        .map((courseIdObj) => courseIdObj.toString())
        .includes(courseId.toString());
      console.log("User has no purchased courses or enrollment not found.");
    }
    console.log("has purchased", hasPurchased);

    const firstSection = (
      await Section.find({ courseId }).sort({ createdAt: 1 })
    )[0];
    if (!firstSection) {
      console.log("No sections found for this course.");
      return res.status(404).json({ message: "No sections found" });
    }
    console.log("first section", firstSection);

    const updatedLectures = lectures.map((lecture, index) => ({
      ...lecture.toObject(),
      locked:
        !hasPurchased &&
        !(sectionId === firstSection._id.toString() && index === 0),
    }));

    console.log("Updated lectures:", updatedLectures); // ✅ Debugging log

    res
      .status(200)
      .json({ message: "Lectures found", lectures: updatedLectures });
  } catch (error) {
    console.error("Error fetching lectures:", error);
    res
      .status(500)
      .json({ message: "Error occurred while getting the lectures" });
  }
};

export const deleteLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;

    console.log("lecture id from params", req.params);

    const lecture = await softDeleteLecture(lectureId);
    // console.log('deleted lecture in the controller',lecture)
    res.status(200).json({ message: "Lecture deleted succesfully", lecture });
  } catch (error) {
    throw new error("Error occured while deleting the lecture");
  }
};
