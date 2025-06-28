import { Router } from 'express';
import { isAuth } from '../../middelwares/auth.js';
import { checkAdminOrInstructor } from '../../middelwares/adminAuth.js';
import multer from 'multer';
import path from 'path';
import {
  createFinalTest,
  createFinalTestSubmission,
  reviewAllFinalTestSubmissions,
  gradeFinalTestSubmission,
  getFinalTestFile,
  downloadStudentSubmission,
  getStudentFinalTestFeedback,
  updateFinalTest,
  deleteFinalTest,
  getFinalTestInfo
} from './finalTest.controller.js';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/finalTests');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'finalTest-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to only allow PDF files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Admin and Instructor routes
router.post('/course/:courseId/create', isAuth(), checkAdminOrInstructor(), upload.single('finalTestFile'), createFinalTest);
router.put('/course/:courseId/update', isAuth(), checkAdminOrInstructor(), upload.single('finalTestFile'), updateFinalTest);
router.delete('/course/:courseId/delete', isAuth(), checkAdminOrInstructor(), deleteFinalTest);
router.get('/course/:courseId/info', isAuth(), checkAdminOrInstructor(), getFinalTestInfo);
router.get('/review', isAuth(), checkAdminOrInstructor(), reviewAllFinalTestSubmissions);
router.post('/:submissionId/grade', isAuth(), checkAdminOrInstructor(), gradeFinalTestSubmission);
router.get('/submission/:submissionId/download', isAuth(), checkAdminOrInstructor(), downloadStudentSubmission);

// Student routes
router.get('/course/:courseId/file', isAuth(), getFinalTestFile);
router.post('/course/:courseId/submit', isAuth(), upload.single('finalTestFile'), createFinalTestSubmission);

router.get('/feedback', isAuth(), getStudentFinalTestFeedback);

export default router; 