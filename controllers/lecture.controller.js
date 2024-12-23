import Lecture from "../models/lectureSchema.js";
import Section from "../models/sectionSchema.js";

export const addLecture = async(req, res) => {
  try {
    const { sectionId } = req.params;
    const lectures = req.body;

    const section = await Section.findById(sectionId)    
    if(!section) {
        return res.status(404).json({message:'Section id not found'})
    }
        const newLecture = new Lecture(lectures)
        await newLecture.save();
        section.lecture.push(newLecture._id);
    
    await section.save();
    res.status(200).json({message:'Lecture added succesfully',section})
  } catch (error) {
    res.status(500).json({ message: "Error occured while adding the lecture" });
  }
};
