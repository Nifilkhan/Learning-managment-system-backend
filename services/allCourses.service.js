import mongoose from "mongoose";
import Course from "../models/courseModel.js";
import Enrollment from "../models/enrollment.schema.js";

export const getAllCoursesService = async ({
  category,
  search,
  limit,
  offset,
  sortBy,
  sortOrder,
  userId,
}) => {
  const parsedLimit = parseInt(limit) || 10;
  const parsedOffset = parseInt(offset) || 0;

  try {
    let purchasedCourseIds = [];
    if (userId) {
      const userEnrollment = await Enrollment.findOne({ userId });
      if (userEnrollment) {
        purchasedCourseIds = userEnrollment.purchasedCourses.map((courseId) =>
          courseId.toString()
        );
      }
    }

    const pipeline = [
      {
        $match: {
          isDeleted: false,
          _id: {
            $nin: purchasedCourseIds.map(
              (id) => new mongoose.Types.ObjectId(id)
            ),
          },
        },
      },
    ];

    // console.log(pipeline);
    if (category && mongoose.Types.ObjectId.isValid(category)) {
      pipeline.push({
        $match: { category: new mongoose.Types.ObjectId(category) },
      });
    }

    // console.log(category);
    if (search) {
      const regex = new RegExp(search, "i");
      pipeline.push({
        $match: {
          $or: [{ title: { $regex: regex } }, { category: { $regex: regex } }],
        },
      });
    }

    if (sortBy && sortOrder) {
      pipeline.push({ $sort: { [sortBy]: sortOrder === "desc" ? -1 : 1 } });
    }

    pipeline.push({
      $facet: {
        data: [{ $skip: parsedOffset }, { $limit: parsedLimit }],
        totalCount: [{ $count: "count" }],
      },
    });

    const [result] = await Course.aggregate(pipeline);
    const courses = result?.data || [];
    const totalCount = result?.totalCount?.[0]?.count || 0;

    const totalCourses = await Course.countDocuments({ isDeleted: false });

    // console.log(courses);
    // console.log(totalCount)
    const populatedCourses = await Course.populate(courses, {
      path: "category",
      select: "name",
    });
    // console.log(populatedCourses)

    return { populatedCourses, totalCount, totalCourses };
  } catch (error) {
    console.error("Error in getAllCoursesService:", error.message);
    throw new Error("Error while fetching courses");
    return { courses: [], totalCount: [] };
  }
};
