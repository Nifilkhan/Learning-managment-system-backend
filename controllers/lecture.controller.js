import Lecture from "../models/lectureSchema.js";
import { addLectureToSection, softDeleteLecture } from "../services/lecture.service.js";
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
    console.log(req.body);

    console.log("Received request to add lecture with data:", req.body);

    const newLecture = new Lecture({
      title,
      contentType,
      videoUrl,
      articleContent,
    });

    const savedLecture = await newLecture.save();

    const updateSection = await addLectureToSection(sectionId, savedLecture._id);

    res
      .status(200)
      .json({ message: "Lecture added succesfully", savedLecture,updateSection });
  } catch (error) {
    console.error("Error occurred while adding the lecture:", error);
    res.status(500).json({ message: "Error occured while adding the lecture" });
  }
};

export const editLecture = async(req,res) => {
  try {
    const { lectureId } = req.params;
    const {title,contentType,videoUrl,articleContent} = req.body;
    console.log("Received request to edit lecture with data:", req.body);

    const updatedLecture = await Lecture.findByIdAndUpdate(
      lectureId,
      {
        title,
        contentType,
        videoUrl,
        articleContent
      },
      { new: true,runValidators:true }
    );

    if(!updatedLecture){
      return res.status(404).json({message:"Lecture not found"});
    }

    res.status(200).json({message:"Lecture edited successfully",updatedLecture});
  } catch (error) {
    throw new error("Error occured while editing the lecture");
  }
};

export const getLecture = async(req,res) => {
  try {
    const {lectureId} = req.params;

    const lecture = await Lecture.findById(lectureId);

    if(!lecture) {
      return res.status(404).json({message:'Lecture not found'})
    }

    res.status(200).json({message:'Lecture Found',lecture})
  } catch (error) {
    throw new error('Error while getting the lecture')
  }
}

export const deleteLecture = async(req,res) => {
  try {
    const {lectureId} = req.params;

    console.log('lecture id from params',req.params);
    

    const lecture = await softDeleteLecture(lectureId);
    console.log('deleted lecture in the controller',lecture)
    res.status(200).json({message:'Lecture deleted succesfully',lecture})
  } catch (error) {
    throw new error('Error occured while deleting the lecture')
  }
}
