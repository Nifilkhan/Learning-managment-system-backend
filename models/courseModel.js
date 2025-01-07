import mongoose from "mongoose";

export const courseSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    price: { type: String, required: true },
    isDeleted: { type: Boolean,default: false  },
    status:{type:String,enum:['draft','published'],default:'draft'},
    section:[{type:mongoose.Schema.Types.ObjectId,ref:'Section'}]
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", courseSchema);

export default Course;
