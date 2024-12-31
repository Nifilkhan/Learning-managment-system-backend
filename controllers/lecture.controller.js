import Lecture from "../models/lectureSchema.js";
import { addLectureToSection } from "../services/lecture.service.js";
import { generatePresignedUrl } from "../config/uploads.js";

export const getPreSignedUrl = async (req, res) => {
  try {
    const { fileName, fileType, courseId } = req.query;
    console.log(req.query);

    if (!fileName || !fileType || !courseId) {
      return res
        .status(400)
        .json({ message: "File name, type, and courseId are required" });
    }

    console.log("Received request for presigned URL with:", req.query);

    const { preSignedUrl, videoUrl } = await generatePresignedUrl(
      fileName,
      fileType,
      courseId
    );
    console.log(preSignedUrl, "presigned url");

    res.status(200).json({ preSignedUrl, videoUrl });
  } catch (error) {
    console.error("Error while generating presigned URL:", error);
    res
      .status(500)
      .json({
        message: "internal error occured while getting the presigned url",
      });
  }
};

export const addLecture = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const { title, contentType, videoUrl, articleContent } = req.body;

    console.log("Received request to add lecture with data:", req.body);

    const newLecture = new Lecture({
      title,
      contentType,
      videoUrl,
      articleContent,
    });

    const savedLecture = await newLecture.save();

    await addLectureToSection(sectionId, savedLecture._id);
    res
      .status(200)
      .json({ message: "Lecture added succesfully", savedLecture });
  } catch (error) {
    console.error("Error occurred while adding the lecture:", error);
    res.status(500).json({ message: "Error occured while adding the lecture" });
  }
};
