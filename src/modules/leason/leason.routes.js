import { Router } from 'express';
import { 
  addleason, 
  getLessonsByCourse, 
  getLesson, 
  updateLesson, 
  deleteLesson,
  addvideotoleason,
  uploadAssignment,
  downloadAssignment
} from './leason.controller.js';
import { isAuth } from '../../middelwares/auth.js';
import { multercloudFunction } from '../../services/multerCloudenary.js';
import { allowedExtensions } from '../../utils/allowedExtentions.js';
import { checkAdminOrInstructor } from '../../middelwares/adminAuth.js'
import multer from 'multer';
import path from 'path';

const router = Router();

// Configure multer for local file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/assignments');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Lesson routes
router.post('/', isAuth(), checkAdminOrInstructor(), addleason);
router.get('/course/:courseId', isAuth(), getLessonsByCourse);
router.get('/:lessonId', isAuth(), getLesson);
router.put('/:lessonId', isAuth(), updateLesson);
router.delete('/:lessonId', isAuth(), deleteLesson);

// Video and assignment routes
router.post('/:lessonId/video', isAuth(), checkAdminOrInstructor(), multercloudFunction(allowedExtensions.Videos).single('video'), addvideotoleason);
router.post('/:lessonId/assignment', isAuth(), checkAdminOrInstructor(), upload.single('file'), uploadAssignment);
router.post('/:lessonId/submit', isAuth(), multercloudFunction(allowedExtensions.Files).single('file'), uploadAssignment);
router.get('/:lessonId/assignment/download', isAuth(), downloadAssignment);

export default router; 