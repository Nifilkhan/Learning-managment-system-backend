import mongoose from "mongoose"
import User from "../models/userModel.js"
import Enrollment from "../models/enrollment.schema.js"

export const getUserCount = async() => {
    return await User.countDocuments({verified:true})
}


export const getVerifiedUsers = async() => {
    return await User.find({verified:true})
}


export const getTotalCourses = async(userId) => {
    const pipeline = [
        {
            $match:{
                userId: new mongoose.Types.ObjectId(userId),
                isDeleted:false
            }
        },{
            $project:{
                _id:0,
                totalCourseCount:{$size:'$purchasedCourses'}
            }
        }
    ]

    const result=  await Enrollment.aggregate(pipeline)
    return result.length > 0 ? result[0].totalCourseCount : 0;
}