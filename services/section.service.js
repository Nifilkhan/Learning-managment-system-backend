import Category from "../models/category.model.js";
import Course from "../models/courseModel.js";
import Section from "../models/sectionSchema.js";
import mongoose from "mongoose";


/**
 * get the section for a course by courseId from the parameter
 * @param {*} courseId 
 * @returns 
 */
export const getSectionsByCourse = async ({ courseId, isDeleted }) => {
  try {
    // Ensure courseId is treated as ObjectId
    const sections = await Section.find({
      courseId: new mongoose.Types.ObjectId(courseId),
      isDeleted: isDeleted !== undefined ? isDeleted : false,
    });
    return sections;
  } catch (error) {
    console.error("Error in getSectionsByCourse:", error.message);
    return null;
  }
};



/**
 * Fetches the category for a course based on the provided category ID.
 * @param {string} category - The ID of the category to look up.
 * @returns {Promise<Object|null>} The category object if found, or null if there's an error or the category doesn't exist.
 */

export const getCategoryById = async(categoryId) => {
  try {

    const courseCategory = await Category.findById(categoryId);
    return courseCategory;
  } catch (error) {
    console.log(error)
    return null;
  }
}

/**
 * Retrieves a course using the course ID from the request parameters.
 * @returns {Promise<Object|null>} The course object if found, or null if there's an error or the course doesn't exist.
 */

export const getCourseById = async(id) => {
  try {
    const course = await Course.findById(id);
    return course;
  } catch (error) {
    return null;
  }
}

export const softDeleteSection = async (courseId,sectionId) => {
  try {
    const section = await Section.findOne({
      courseId,
      _id:sectionId,
      isDeleted:false
    });

    if(!section) {
      return null;
    }

  const updateSection =  await Section.findByIdAndUpdate(sectionId,{isDeleted:true},{new:true});
    return updateSection;
    
  } catch (error) {
    console.error("Error in softDelectsection service:", error);
    throw error;
  }
};
