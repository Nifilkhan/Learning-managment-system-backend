import express from "express";
import { addLecture, deleteLecture, editLecture, getLecture, getLectures, getPreSignedUrl } from "../controllers/lecture.controller.js";
import { authenticatedUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post('/sections/:sectionId/addLecture',addLecture);
router.put('/:lectureId/editLecture',editLecture);
router.get('getLecture/:lectureId',getLecture);
router.delete('/delete-lecture/:lectureId',deleteLecture);
router.get('/presigned-url',getPreSignedUrl);
router.get('/getLectures/:sectionId',authenticatedUser,getLectures)

export default router;