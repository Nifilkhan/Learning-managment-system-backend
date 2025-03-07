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
                $limit:4
            }
        ]
        // console.log(pipeline)

        const latestCourses = await Course.aggregate(pipeline);
        // console.log(latestCourses)
        return latestCourses;
    } catch (error) {
        throw new error('Error occured while getting the latest course',error)
    }
}