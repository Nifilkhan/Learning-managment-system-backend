import mongoose from "mongoose";
import { lectureSchema } from "./lectureSchema.js";


export const sectionSchema = mongoose.Schema({
    courseId:{type:mongoose.Schema.Types.ObjectId, ref:'Course'},
    title:{type:String,required:true},
    lecture:[{type:mongoose.Schema.Types.ObjectId,ref:'Lecture'}]
}, {timestamps:true})

const Section = mongoose.model('Section',sectionSchema);
export default Section;