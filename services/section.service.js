import Category from "../models/category.model.js";
import Course from "../models/courseModel.js";
import Section from "../models/sectionSchema.js";


/**
 * get the section for a course by courseId from the parameter
 * @param {*} courseId 
 * @returns 
 */
export const getSectionsByCourse = async(courseId) => {
  try {
    const section = await Section.find({courseId});
    return section;
  } catch (error) {
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

export const deleteSection = async (sectionId) => {
  try {
    await Section.findByIdAndUpdate(sectionId, { isDeleted: true });
  } catch (error) {
    return null;
  }
};
