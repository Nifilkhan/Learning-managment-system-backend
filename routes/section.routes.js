import express from "express";
import { addSection, deleteSection, getSection } from "../controllers/section.controller.js";
import { validateSection } from "../middleware/validating.middleware.js";
import { addSectionSchema } from "../validations/course.validations.js";

const router = express.Router();

router.post('/addSection/:courseId', addSection);
router.get('/get-section/:courseId',getSection)
router.delete('/course/:courseId/section/:sectionId',deleteSection)

export default router;