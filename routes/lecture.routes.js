import express from "express";
import { addLecture, deleteLecture, editLecture, getLecture, getPreSignedUrl } from "../controllers/lecture.controller.js";
import { validateLecture } from "../middleware/validating.middleware.js";

const router = express.Router();

router.post('/sections/:sectionId/addLecture',addLecture);
router.put('/:lectureId/editLecture',editLecture);
router.get('getLecture/:lectureId',getLecture);
router.delete('/:lectureId',deleteLecture);
router.get('/presigned-url',getPreSignedUrl);

export default router;