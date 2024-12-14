import mongoose from "mongoose";

export const sectionSchema = mongoose.Schema({
    courseId:{type:mongoose.Schema.Types.ObjectId, ref:'Course'},
    title:{type:String,required:true},
}, {timestamps:true})

const Section = mongoose.model('Section',sectionSchema);
export default Section;