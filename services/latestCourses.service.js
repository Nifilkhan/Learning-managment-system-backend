import Course from "../models/courseModel.js"

export const getLatestCourseService = async() => {
    try {
        const pipeline = [
            {
                $match:{isDeleted:false}
            },
            {
                $sort:{createdAt:-1}
            },
            {
                $limit:5
            }
        ]

        const latestCourses = await Course.aggregate(pipeline);
        return latestCourses;
    } catch (error) {
        throw new error('Error occured while getting the latest course',error)
    }
}