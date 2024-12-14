import mongoose from "mongoose";

const contentSchema = mongoose.model({
    lectureId:{type:mongoose.Schema.Types.ObjectId, ref:'Lecture',required:true},
    contentType: { type: String, enum: ['video', 'article'], required: true },  // Content type (video or article)
    title:{type:String,required:true},
    videoUrl:{type:String,required:true},
    articleContent:{type:String,required:true}
})

const Content = mongoose.Schema('Content',contentSchema);
export default Content;