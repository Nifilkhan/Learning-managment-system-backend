import mongoose from "mongoose";

const entrollmentSchema = mongoose.Schema({
    userId:{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    purchasedCourses: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    ],
},{
    timestamps: true,
});

export default mongoose.model("Enrollment",entrollmentSchema);