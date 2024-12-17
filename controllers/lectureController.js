import Lecture from "../models/lectureSchema.js";
import Section from "../models/sectionSchema.js";

export const addLecture = async(req, res) => {
  try {
    const { sectionId } = req.params;
    const lectures = req.body;

    const section = await Section.findById(sectionId)
    console.log("section id:",section);
    
    if(!section) {
        return res.status(404).json({message:'Section id not found'})
    }
        const newLecture = new Lecture(lectures)
        console.log("created lecture",newLecture);
        await newLecture.save();
        section.lecture.push(newLecture._id);
    
    await section.save();
    console.log("section that including the lecture data",section)
    res.status(200).json({message:'Lecture added succesfully',section})
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error occured while adding the lecture" });
  }
};
