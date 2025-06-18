import { Router } from 'express';
import { isAuth } from '../../middelwares/auth.js';
import multer from 'multer';
import path from 'path';
import {
  createFinalTest,
  createFinalTestSubmission,
  reviewAllFinalTestSubmissions,
  gradeFinalTestSubmission,
  getFinalTestFile,
  downloadStudentSubmission,
  getStudentFinalTestFeedback
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

// Admin routes
router.post('/course/:courseId/create', isAuth(), upload.single('finalTestFile'), createFinalTest);
router.get('/review', isAuth(), reviewAllFinalTestSubmissions);
router.post('/:submissionId/grade', isAuth(), gradeFinalTestSubmission);
router.get('/submission/:submissionId/download', isAuth(), downloadStudentSubmission);

// Student routes
router.get('/course/:courseId/file', isAuth(), getFinalTestFile);
router.post('/course/:courseId/submit', isAuth(), upload.single('finalTestFile'), createFinalTestSubmission);

router.get('/feedback', isAuth(), getStudentFinalTestFeedback);

export default router; 