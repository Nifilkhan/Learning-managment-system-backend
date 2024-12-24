import mongoose from "mongoose";


export const sectionSchema = mongoose.Schema({
    courseId:{type:mongoose.Schema.Types.ObjectId, ref:'Course',required:true},
    title:{type:String,required:true},
    lecture:[{type:mongoose.Schema.Types.ObjectId,ref:'Lecture'}],
    isDeleted: { type: Boolean, default: false },
}, {timestamps:true})

const Section = mongoose.model('Section',sectionSchema);
export default Section;