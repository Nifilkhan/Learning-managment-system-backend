import express from "express";
import {
  addCourse,
  deleteCourse,
  editCourse,
  getAllCourse,
  getAllCourses,
  getCourse,
  getLatestCourses,
  monthlySale,
} from "../controllers/course.controller.js";
// import adminMiddleware from "../middleware/adminMiddleware.js";
import { createCategory, getCategory } from "../controllers/category.controller.js";
import { validateRequest } from "../middleware/validating.middleware.js";
import { addCourseSchema } from "../validations/course.validations.js";

const router = express.Router();

router.post(
  "/add-course",
  validateRequest(addCourseSchema),
  addCourse
);
router.get("/get-course/:id", getCourse);
router.get("/all-courses", getAllCourses);
router.delete('/delete-course/:id',deleteCourse);
router.put('/edit-course/:id' ,editCourse);
router.get('/get-courses',getAllCourse);

//sales report of the course per month
router.get('/monthly-sale',monthlySale);
//category
router.post('/add-category',createCategory)
router.get('/get-category',getCategory)

//latest course 
router.get("/latest-courses",getLatestCourses)

export default router;
