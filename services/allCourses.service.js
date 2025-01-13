import mongoose from "mongoose";
import Course from "../models/courseModel.js";

export const getAllCoursesService = async ({
  category,
  search,
  limit,
  offset,
}) => {
  const parsedLimit = parseInt(limit) || 10;
  const parsedOffset = parseInt(offset) || 0;

  const pipeline = [
    {
      $match: { isDeleted: false },
    },
  ];

  // console.log(pipeline);
  if (category & mongoose.Types.ObjectId.isValid(category)) {
    pipeline.push({ $match: { category: mongoose.Types.ObjectId(category) } });
  }

  // console.log(category);
  if (search) {
    const regex = new RegExp(search, "i");
    pipeline.push({
      $match: {
        $or: [{ title: { $regex: regex } }, { description: { $regex: regex } }],
      },
    });
  }

  // if (sortBy) {
  //   pipeline.push({ $sort: { [sortBy]: sortOrder === "desc" ? -1 : 1 } });
  // }

  pipeline.push({
    $facet: {
      data: [{ $skip: parsedOffset }, { $limit: parsedLimit }],
      totalCount: [{ $count: "count" }],
    },
  });

  try {
    const [result] = await Course.aggregate(pipeline);
    const courses = result?.data || [];
    const totalCount = result?.totalCount?.[0]?.count || 0;

    console.log(courses);
    console.log(totalCount)

    return { courses, totalCount };
  } catch (error) {
    console.error("Error in getAllCoursesService:", error.message);
    throw new Error("Error while fetching courses");
    return {courses:[],totalCount:[]}
  }
};
