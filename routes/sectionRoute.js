import express from "express";
import { addSection } from "../controllers/sectionController.js";

const router = express.Router();

router.post('/addSection/:courseId', addSection);

export default router;