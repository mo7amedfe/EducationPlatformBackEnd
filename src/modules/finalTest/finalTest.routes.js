import { Router } from 'express';
import { isAuth } from '../../middelwares/auth.js';
import { checkAdminOrInstructor } from '../../middelwares/adminAuth.js';
import {
  createFinalTest,
  createFinalTestSubmission,
  reviewAllFinalTestSubmissions,
  gradeFinalTestSubmission,
  getFinalTestFile,
  downloadStudentSubmission,
  getStudentFinalTestFeedback,

} from './finalTest.controller.js';
import { multercloudFunction } from '../../services/multerCloudenary.js';
import { allowedExtensions } from '../../utils/allowedExtentions.js';

const router = Router();



// Admin and Instructor routes
router.post('/course/:courseId/create', isAuth(), checkAdminOrInstructor(),multercloudFunction(allowedExtensions.Files).single('finalTestFile'), createFinalTest);
router.post('/:submissionId/grade', isAuth(), checkAdminOrInstructor(), gradeFinalTestSubmission);
router.get('/review', isAuth(), checkAdminOrInstructor(), reviewAllFinalTestSubmissions);
router.get('/submission/:submissionId/download', isAuth(), checkAdminOrInstructor(), downloadStudentSubmission);

// Student routes
router.get('/course/:courseId/file', isAuth(), getFinalTestFile);
router.post('/course/:courseId/submit', isAuth(), multercloudFunction(allowedExtensions.Files).single('finalTestFile'), createFinalTestSubmission);
router.get('/feedback', isAuth(), getStudentFinalTestFeedback);

export default router; 