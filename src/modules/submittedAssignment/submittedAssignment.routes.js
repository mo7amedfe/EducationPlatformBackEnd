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
import multer from 'multer';
import path from 'path';

const router = Router();

// Configure multer for local file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/submissions');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

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

// Admin routes
router.get('/review', isAuth(), reviewAllSubmissions);
router.post('/:submissionId/grade', isAuth(), gradeSubmission);
router.get('/:submissionId/download', isAuth(), downloadSubmission);

export default router; 