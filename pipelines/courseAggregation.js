import course from "../models/courseModel.js";

export async function getMonthlySaleData () {
    try {
        const monthlySale = await course.aggregate([
            {
                $group:{
                    _id:{
                        year:{$year:$createdAt},
                        month:{$month:$createdAt}
                    },
                    courseCount:{$sum:1}
                },
            },
            {
                $sort:{
                    "_id.year":1,
                    "_id.month":1,
                },
            },
            {
                $project:{
                    _id:0,
                    year:"$_id.year",
                    month:"$_id.month",
                    courseCount:1,
                }
            }
        ])
        return monthlySale;
    } catch (error) {
        console.log(error)
    }
} 

export default getMonthlySaleData;