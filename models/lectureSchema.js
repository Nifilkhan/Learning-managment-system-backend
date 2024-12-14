import mongoose from "mongoose";

export const lectureSchema = mongoose.Schema({
    sectionId:{type:mongoose.Schema.Types.ObjectId, ref:'Section',required:true},
    title:{type:String,required:true},
},{timestamps:true})

const Lecture = mongoose.model('Lecture',lectureSchema)
export default Lecture;