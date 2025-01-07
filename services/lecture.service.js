import Lecture from "../models/lectureSchema.js";
import Section from "../models/sectionSchema.js";

export const addLectureToSection = async(sectionId,lectureId) => {

   try {
      const updateSection =  await Section.findByIdAndUpdate(
         sectionId, 
         {$push: {lectures:lectureId} },
         {new:true}
      );

      return updateSection;
   } catch (error) {
      console.error('Error occurred while adding lecture to section:', error);
      throw error;
   }

};

export const softDeleteLecture = async(lectureId) => {
   try {
      console.log('Received lectureId:', lectureId); // Debugging

         const lecture = await Lecture.find({
            _id:lectureId,
            isDeleted:false
         });
         console.log('lecture in the service of lecture delete ',lecture)

         if(!lecture) {
            return null;
         }
         const UpdateLecture = await Lecture.findByIdAndUpdate(
            lectureId,
            {isDeleted:true},
            {new:true}
         );

         console.log('update lecture in the soft delete function of lecture service',UpdateLecture);
         

         return UpdateLecture;
   } catch (error) {
      throw new error('Error in soft delete service')
   }
}