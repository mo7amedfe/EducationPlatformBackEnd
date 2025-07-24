import { Router } from 'express';
import { addleason, 
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

const router = Router();


// Lesson routes
router.post('/', isAuth(), checkAdminOrInstructor(), addleason);
router.get('/course/:courseId', isAuth(), getLessonsByCourse);
router.get('/:lessonId', isAuth(), getLesson);
// Video and assignment routes
router.post('/:lessonId/video', isAuth(), checkAdminOrInstructor(), multercloudFunction(allowedExtensions.Videos).single('video'), addvideotoleason);
router.post('/:lessonId/submit', isAuth(), multercloudFunction(allowedExtensions.Files).single('file'), uploadAssignment);
router.get('/:lessonId/assignment/download', isAuth(), downloadAssignment);

export default router; 