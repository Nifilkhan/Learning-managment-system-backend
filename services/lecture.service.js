import Section from "../models/sectionSchema.js";

export const addLectureToSection = async(sectionId,lectureId) => {
 await Section.findByIdAndUpdate(
    sectionId, 
    {$push: {lectures:lectureId} },
    {new:true}
 );
};