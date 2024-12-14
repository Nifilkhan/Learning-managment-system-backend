import express from "express";
import upload from "../config/uploads.js";
import {
  addCourse,
  deleteCourse,
  editCourse,
  getAllCourses,
  getCourse,
  monthlySale,
} from "../controllers/courseController.js";
// import adminMiddleware from "../middleware/adminMiddleware.js";
import { createCategory, getCategory } from "../controllers/categoryController.js";

const router = express.Router();

router.post(
  "/add-course",
  upload.fields([{ name: "coverImage", maxCount: 1 }, { name: "videos" }]),
  addCourse
);
router.get("/get-course/:id", getCourse);
router.get("/all-courses", getAllCourses);
router.delete('/delete-course/:id',deleteCourse);
router.put('/edit-course/:id' ,upload.fields([{ name: "coverImage", maxCount: 1 }, { name: "videos" }]),
editCourse)

//sales report of the course per month
router.get('/monthly-sale',monthlySale);
//category
router.post('/add-category',createCategory)
router.get('/get-category',getCategory)

export default router;
