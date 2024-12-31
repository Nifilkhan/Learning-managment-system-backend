import express from "express";
import { addLecture, getPreSignedUrl } from "../controllers/lecture.controller.js";
import { validateLecture } from "../middleware/validating.middleware.js";

const router = express.Router();

router.post('/sections/:sectionId/addLecture',addLecture);
router.get('/presigned-url',getPreSignedUrl);

export default router;