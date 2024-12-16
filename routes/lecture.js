import express from "express";
import { addLecture } from "../controllers/lectureController.js";

const router = express.Router();

router.post('/addLecture/:sectionId',addLecture);

export default router;