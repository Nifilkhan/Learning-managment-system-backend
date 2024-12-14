import mongoose from "mongoose";

export const courseSchema = mongoose.Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},
    category:{type:mongoose.Schema.Types.ObjectId, ref:'Category',required:true},
    price:{type:String,required:true},
    coverImage:{type:String, required:true},
    video:[String],
    status: { type: String, enum: ['Draft', 'Published'], default: 'Draft' }
    }, {
        timestamps:true
    })


    const Course =mongoose.model('Course',courseSchema);

    export default Course;