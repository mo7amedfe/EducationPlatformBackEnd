import { submittedAssignmentModel } from '../../../connections/models/submittedAssignment.model.js';
import { asyncHandler } from '../../utils/errorHandeling.js';
import { leasonModel } from '../../../connections/models/leason.model.js';
import fs from 'fs';
import path from 'path';
import cloudinary from '../../utils/cloudinaryConfigration.js';
import axios from 'axios';
import https from 'https'; // ضروري علشان نعمل request للملف من Cloudinary




// Download a submission (for students to download their own submission)

export const downloadMySubmission = asyncHandler(async (req, res, next) => {
  const { submissionId } = req.params;
  const userId = req.authuser._id;

  const submission = await submittedAssignmentModel.findOne({ _id: submissionId, userId });
  if (!submission || !submission.file || !submission.file.url) {
    return res.status(404).json({ message: 'Submission not found or unauthorized' });
  }

  const fileUrl = submission.file.url;

  // طلب مباشر للملف من Cloudinary
  https.get(fileUrl, (fileRes) => {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=submission.pdf');
    fileRes.pipe(res);
  }).on('error', (err) => {
    console.error('File download error:', err);
    res.status(500).json({ message: 'Failed to download file.' });
  });
});

// Create a submission
export const createSubmission = asyncHandler(async (req, res, next) => {
    try {
      const { lessonId } = req.params;
      const userId = req.authuser._id;
  
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized: User ID not found" });
      }
  
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
  
      // Upload file to Cloudinary
      let cloudinaryResult;
      try {
        cloudinaryResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              resource_type: "raw",
              folder: "assignmentSubmissions",
              format: "pdf"
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          uploadStream.end(req.file.buffer);
        });
      } catch (err) {
        return res.status(500).json({ message: "Cloudinary upload error", error: err.message });
      }
  
      const submission = await submittedAssignmentModel.create({
        lessonId,
        userId,
        file: { url: cloudinaryResult.secure_url, public_id: cloudinaryResult.public_id },
        submittedAt: new Date()
      });
  
      // Add this block to update the lesson's submissions array
      await leasonModel.findByIdAndUpdate(
        lessonId,
        { $push: { submissions: submission._id } }
      );
  
      res.status(201).json({ message: 'Submission created successfully', submission });
    } catch (error) {
      console.error('Error creating submission:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  });


// Review all submissions (admin and instructor only)
export const reviewAllSubmissions = asyncHandler(async (req, res, next) => {
  const { role } = req.authuser;

  if (role !== 'Admin' && role !== 'Instructor') {
    return res.status(403).json({ message: 'Unauthorized: Admin or Instructor access required' });
  }

  const submissions = await submittedAssignmentModel.find()
    .populate({
      path: 'userId',
      select: 'username email'
    })
    .populate({
      path: 'lessonId',
      select: 'title description courseId',
      populate: {
        path: 'courseId',
        select: 'title   imageurl'
      }
    });

  res.status(200).json({
    submissions: submissions.map(sub => ({
      ...sub.toObject(),
      reviewerName: sub.reviewerName || null,
      reviewerEmail: sub.reviewerEmail || null
    }))
  });
});

// Grade a submission (admin and instructor only)
export const gradeSubmission = asyncHandler(async (req, res, next) => {
  const { submissionId } = req.params;
  const { rating, feedback } = req.body;
  const { role,username,email } = req.authuser;
  const reviewerUserName= username
  const reviewerEmail= email

  if (role !== 'Admin' && role !== 'Instructor') {
    return res.status(403).json({ message: 'Unauthorized: Admin or Instructor access required' });
  }

  if (rating < 0 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 0 and 5' });
  }

  const submission = await submittedAssignmentModel.findById(submissionId);
  if (!submission) {
    return res.status(404).json({ message: 'Submission not found' });
  }

  submission.rating = rating;
  if (feedback) submission.feedback = feedback;
  submission.status = 'graded';
  submission.reviewerName = reviewerUserName;
  submission.reviewerEmail = reviewerEmail;
  await submission.save();

  // Get the updated submission with populated fields
  const updatedSubmission = await submittedAssignmentModel.findById(submissionId)
    .populate({
      path: 'userId',
      select: 'username email'
    })
    .populate({
      path: 'lessonId',
      select: 'title description courseId',
      populate: {
        path: 'courseId',
        select: 'title imageurl'
      }
    });

  res.status(200).json({ 
    message: 'Submission graded successfully', 
    submission: updatedSubmission,
    reviewerName: reviewerUserName,
    reviewerEmail: reviewerEmail
  });

  
});


// Download a submission (for admin and instructor to download any submission)

export const downloadSubmission = asyncHandler(async (req, res) => {
  const { submissionId } = req.params;

  const submission = await submittedAssignmentModel.findById(submissionId);
  if (!submission || !submission.file?.url) {
    return res.status(404).json({ message: 'Submission not found' });
  }

  const cloudinaryUrl = submission.file.url;

  try {
    const response = await axios({
      method: 'GET',
      url: cloudinaryUrl,
      responseType: 'arraybuffer', // ← مهم جداً علشان تبني blob من الـ buffer
      maxRedirects: 5,
    });

    const contentType = response.headers['content-type'] || 'application/pdf';
    const contentLength = response.headers['content-length'] || undefined;

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', 'attachment; filename="submission.pdf"');

    if (contentLength) {
      res.setHeader('Content-Length', contentLength);
    }

    res.status(200).send(response.data); // ← رجّع الـ buffer مباشرة
  } catch (error) {
    console.error('Failed to download file:', error.message);
    res.status(500).json({ message: 'Error downloading file', error: error.message });
  }
});

