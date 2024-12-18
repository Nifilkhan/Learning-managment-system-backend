import express from "express";
import { addSection, deleteSection, getSection } from "../controllers/section.controller.js";

const router = express.Router();

router.post('/addSection/:courseId', addSection);
router.get('/get-section/:courseId',getSection)
router.delete('/course/:courseId/section/:sectionId',deleteSection)

export default router;