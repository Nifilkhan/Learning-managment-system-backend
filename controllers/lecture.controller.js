import Lecture from "../models/lectureSchema.js";
import { addLectureToSection } from "../services/lecture.service.js";
import { generatePresignedUrl } from "../services/s3.service.js";


export const getPreSignedUrl = async(req,res) => {
  try {
    const {fileName,fileType} = req.query;

    if(!fileName || !fileType) {
      return res.status(400).json({message:'File name and type are required'});
    }
    const preSignedUrl = await generatePresignedUrl(fileName,fileType);
    res.json({url:preSignedUrl});
  } catch (error) {
    res.status(500).json({message:'internal error occured while getting the presigned url'})
  }
}


export const addLecture = async(req, res) => {
  try {
    const { sectionId } = req.params;
    const { title, contentType, videoUrl, articleContent } = req.body;

    const newLecture = new Lecture({
      title,
      contentType,
      videoUrl,
      articleContent
    })

    const savedLecture = await newLecture.save();
    
    await addLectureToSection(sectionId,savedLecture._id);
    res.status(200).json({message:'Lecture added succesfully',savedLecture})
  } catch (error) {
    res.status(500).json({ message: "Error occured while adding the lecture" });
  }
};
