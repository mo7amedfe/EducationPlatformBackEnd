import { Router } from 'express';
import { 
  createSubmission, 
  downloadMySubmission,
  downloadSubmission,
  reviewAllSubmissions,
  gradeSubmission,
  getStudentAssignmentSubmissions,
} from './submittedAssignment.controller.js';
import { isAuth } from '../../middelwares/auth.js';
import { checkAdminOrInstructor } from '../../middelwares/adminAuth.js';
import multer from 'multer';


const router = Router();

// Configure multer for memory storage (for Cloudinary upload)
const storage = multer.memoryStorage();

const upload = multer({ storage });


// Student routes
router.get('/my-submissions/:submissionId/download', isAuth(), downloadMySubmission);
router.post('/:lessonId/submissions', isAuth(), upload.single('file'), createSubmission);
router.get('/submissions', isAuth(), getStudentAssignmentSubmissions);

// Admin and Instructor routes
router.get('/review', isAuth(), checkAdminOrInstructor(), reviewAllSubmissions);
router.post('/:submissionId/grade', isAuth(), checkAdminOrInstructor(), gradeSubmission);
router.get('/:submissionId/download', isAuth(), checkAdminOrInstructor(), downloadSubmission);

export default router; 