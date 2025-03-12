import Enrollment from "../models/enrollment.schema.js";

export const purchasedCourseService = async(userId) => {
    try {
        const userEnrollment = await Enrollment.findOne({userId}).populate('purchasedCourses');
        console.log(userEnrollment,'service enrollment')
        return userEnrollment?.purchasedCourses || [];
        
    } catch (error) {
        console.log('error occured in purchased Course service');
        throw new Error(error)
    }
}