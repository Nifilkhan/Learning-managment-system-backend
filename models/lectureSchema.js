import mongoose, { Mongoose } from "mongoose";

export const lectureSchema = mongoose.Schema({
    title:{type:String,required:true},
    contentType: { type: String, enum: ['video', 'article'], required: true },  
    videoUrl:{type:String,required:function() {
        return this.contentType === 'video'
    }},
    articleContent:{type:String,required:function() {
        return this.contentType === 'article'
    }},
})

const Lecture = mongoose.model('Lecture',lectureSchema);
export default Lecture;