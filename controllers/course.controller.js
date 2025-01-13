// import { Promise } from 'mongoose';
import Course from "../models/courseModel.js";
import { getMonthlySaleData } from "../pipelines/courseAggregation.js";
import mongoose from "mongoose";
import { getCategoryById, getCourseById } from "../services/section.service.js";
import { getAllCoursesService } from "../services/allCourses.service.js";

/**
 * Add a new course
 */

export const addCourse = async (req, res) => {
  try {
    const { title, category, description, price } = req.body;

    const courseCategory = await getCategoryById(category);

    if (!courseCategory) {
      return res.status(402).json({ message: "Invalid id of category" });
    }

    const newCourse = new Course({
      title,
      description,
      category,
      price,
    });

    await newCourse.save();

    // console.log('new course',newCourse);

    res.json({ message: "Course created succesfully", course: newCourse });
  } catch (error) {
    res.status(500).json({ error: "Error adding the course." });
  }
};

/**
 * Get a single course by the id
 */

export const getCourse = async (req, res) => {
  try {
    const course = await getCourseById(req.params.id);

    if (!course) {
      return res.status(402).json({ message: "Id not match" });
    }
    res.status(200).json({ message: "Course found by id", course });
  } catch (error) {
    res.status(500).json({ message: "error while getting the course" });
  }
};

/**
 * Get all the courses in the collection
 */

export const getAllCourses = async (req, res) => {
  try {
    const { limit, offset, search, category } = req.query;

    console.log(req.query);

    const { courses, totalCount } = await getAllCoursesService({
      category,
      search,
      limit,
      offset,
    });

    console.log(totalCount);
    console.log(courses)

    const parsedLimit = parseInt(limit,10);
    const parsedOffset = parseInt(offset,0);

    const currentPage = Math.floor(parsedOffset / parsedLimit) + 1;
    const totalPages = Math.ceil(totalCount / parsedLimit);

    res
      .status(200)
      .json({
        message: "All course found by ",
        courses,
        totalCount,
        currentPage,
        totalPages,
      });
  } catch (error) {
    res.status(500).json({ message: "error while getting the course" });
  }
};

/**
 * Edit course with the specific id
 */

export const editCourse = async (req, res) => {
  try {
    const { title, price, description, category } = req.body;

    const course = await getCourseById(req.params.id);

    if (!course) {
      return res
        .status(404)
        .json({ message: "Course not found with the specific id" });
    }

    const updateData = {
      title: title || course.title,
      description: description || course.description,
      price: price || course.price,
      category: mongoose.isValidObjectId(category) ? category : course.category,
    };

    const updateCourse = await Course.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    res
      .status(200)
      .json({ message: "Course updated successfully", updateCourse });
  } catch (error) {
    res
      .status(402)
      .json({ message: "Error happend while updating the course" });
  }
};

/**
 * delete the course by the id
 */

export const deleteCourse = async (req, res) => {
  try {
    const course = await getCourseById(req.params.id);

    if (!course) {
      return res.status(402).json({ message: "Course not found with the id" });
    }
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ message: "course deleted successfully", deletedCourse });
  } catch (error) {
    res.status(500).json({ message: "error while deleting the course" });
  }
};

/**
 * get the monthly sales of each month to show the sales report in the grapgh chart by this data
 */
export const monthlySale = async (req, res) => {
  try {
    const data = await getMonthlySaleData;
    res.json({ message: "No right now data available", data });
  } catch (error) {
    console.log(error);
  }
};

export default { addCourse, getCourse, getAllCourses };
