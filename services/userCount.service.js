import mongoose from "mongoose"
import User from "../models/userModel.js"

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
                isDeleted:false,
                userId: new mongoose.Types.ObjectId(userId)
            },
            $group:{
                _id:'$userId',
                totalCourseCount:{$sum:{$size:'$purcasedCourses'}}
            }
        }
    ]

    return await Enrollment.aggregate(pipeline)
}