import User from "../models/userModel.js"

export const getUserCount = async() => {
    return await User.countDocuments({verified:true})
}


export const getVerifiedUsers = async() => {
    return await User.find({verified:true})
}