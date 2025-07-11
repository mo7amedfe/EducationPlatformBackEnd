import { Router } from 'express';
import { 
  getAllSubmissions, 
  getSubmissionById, 
  createSubmission, 
  updateSubmission, 
  deleteSubmission,
  getMySubmission,
  downloadMySubmission,
  downloadSubmission,

  reviewAllSubmissions,
  gradeSubmission,
  getStudentAssignmentSubmissions
} from './submittedAssignment.controller.js';
import { isAuth } from '../../middelwares/auth.js';
import { checkAdminOrInstructor } from '../../middelwares/adminAuth.js';
import multer from 'multer';
import path from 'path';

const router = Router();

// Configure multer for memory storage (for Cloudinary upload)
const storage = multer.memoryStorage();

const upload = multer({ storage });

// Get all submissions for a lesson
router.get('/:lessonId/submissions', isAuth(), getAllSubmissions);

// Get a submission by ID
router.get('/:lessonId/submissions/:submissionId', isAuth(), getSubmissionById);

// Create a submission
router.post('/:lessonId/submissions', isAuth(), upload.single('file'), createSubmission);

// Update a submission
router.put('/:lessonId/submissions/:submissionId', isAuth(), updateSubmission);

// Delete a submission
router.delete('/:lessonId/submissions/:submissionId', isAuth(), deleteSubmission);

// Student routes
router.get('/my-submissions/:submissionId', isAuth(), getMySubmission);
router.get('/my-submissions/:submissionId/download', isAuth(), downloadMySubmission);
router.post('/lesson/:lessonId/submit', isAuth(), upload.single('assignmentFile'), createSubmission);
router.get('/submissions', isAuth(), getStudentAssignmentSubmissions);

// Admin and Instructor routes
router.get('/review', isAuth(), checkAdminOrInstructor(), reviewAllSubmissions);
router.post('/:submissionId/grade', isAuth(), checkAdminOrInstructor(), gradeSubmission);
router.get('/:submissionId/download', isAuth(), checkAdminOrInstructor(), downloadSubmission);

export default router; 