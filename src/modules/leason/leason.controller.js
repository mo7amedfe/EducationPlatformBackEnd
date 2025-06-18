// lesson.controller.js
import { leasonModel } from "../../../connections/models/leason.model.js";
import { asyncHandler } from "../../utils/errorHandeling.js";
import { v2 as cloudinary } from 'cloudinary';
import { courseModel } from '../../../connections/models/course.model.js';
import mongoose from 'mongoose';
import axios from 'axios';

// Add a new lesson to a course
export const addleason = asyncHandler(async (req, res, next) => {
  const { LessonTitle, LessonDescription, courseId } = req.body;

  if (!LessonTitle || !LessonDescription || !courseId) {
    return res.status(400).json({ message: "title, description, and courseId are required" });
  }

  const courseCheck = await courseModel.findById(courseId);
  if (!courseCheck) {
    return res.status(400).json({ message: 'Invalid course ID' });
  }

  const leason = await leasonModel.create({
    title: LessonTitle,
    description: LessonDescription,
    courseId
  });

  courseCheck.lessons.push(leason._id);
  await courseCheck.save();

  res.status(201).json({ message: "Lesson added successfully", leason });
});

// Get all lessons for a specific course
export const getLessonsByCourse = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;
  const userId = req.authuser._id; // Get the authenticated user's ID

  const course = await courseModel.findById(courseId);
  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }

  const courselessons = await leasonModel.find({ courseId })
    .select('title description video assignment submissions')
    .populate({
      path: 'submissions',
      match: { userId: userId } // Only populate submissions for the current user
    });

  res.status(200).json({ 
    message: 'Lessons retrieved successfully',
    courseName: course.title,
    courseId: course._id,
    courseImage: course.imageurl,
    courseDescription: course.description,
    courselessons 
  });
});

// Get a specific lesson
export const getLesson = asyncHandler(async (req, res, next) => {
  const { lessonId } = req.params;

  const lesson = await leasonModel.findById(lessonId)
    .populate('courseId', 'title')
    .populate('submissions.userId', 'name email');

  if (!lesson) {
    return res.status(404).json({ message: 'Lesson not found' });
  }

  res.status(200).json({ 
    message: 'Lesson retrieved successfully',
    lesson 
  });
});

// Update a lesson
export const updateLesson = asyncHandler(async (req, res, next) => {
  const { lessonId } = req.params;
  const { title, description } = req.body;

  const lesson = await leasonModel.findById(lessonId);
  if (!lesson) {
    return res.status(404).json({ message: 'Lesson not found' });
  }

  if (title) lesson.title = title;
  if (description) lesson.description = description;

  await lesson.save();

  res.status(200).json({ 
    message: 'Lesson updated successfully',
    lesson 
  });
});

// Delete a lesson
export const deleteLesson = asyncHandler(async (req, res, next) => {
  const { lessonId } = req.params;

  const lesson = await leasonModel.findById(lessonId);
  if (!lesson) {
    return res.status(404).json({ message: 'Lesson not found' });
  }

  if (lesson.video?.public_id) {
    await cloudinary.uploader.destroy(lesson.video.public_id);
  }
  if (lesson.assignment?.public_id) {
    await cloudinary.uploader.destroy(lesson.assignment.public_id);
  }
  for (const submission of lesson.submissions) {
    if (submission.file?.public_id) {
      await cloudinary.uploader.destroy(submission.file.public_id);
    }
  }

  await courseModel.findByIdAndUpdate(
    lesson.courseId,
    { $pull: { lessons: lessonId } }
  );

  await leasonModel.findByIdAndDelete(lessonId);

  res.status(200).json({ message: 'Lesson deleted successfully' });
});

// Upload video to lesson
export const addvideotoleason = asyncHandler(async (req, res, next) => {
  const { lessonId } = req.params;

  if (!req.file) {
    return next(new Error("No video file uploaded", { cause: 400 }));
  }

  try {
    const { secure_url, public_id, duration, format } = await cloudinary.uploader.upload(req.file.path, {
      folder: `leason/video/${lessonId}`,
      use_filename: true,
      unique_filename: false,
      resource_type: 'video',
      chunk_size: 6000000
    });

    const videoleason = await leasonModel.findByIdAndUpdate(
      lessonId,
      {
        video: {
          secure_url,
          public_id,
          duration,
          format
        }
      },
      { new: true }
    );

    if (!videoleason) {
      await cloudinary.uploader.destroy(public_id);
      return next(new Error("Lesson not found", { cause: 404 }));
    }

    res.status(200).json({
      message: 'Video uploaded successfully',
      lesson: videoleason
    });
  } catch (error) {
    return next(error);
  }
});

// Upload assignment file
export const uploadAssignment = asyncHandler(async (req, res, next) => {
  const { lessonId } = req.params;
  const { title, description, dueDate } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // Save file locally instead of Cloudinary
  const filePath = req.file.path; // multer saves the file locally

  const updatedLesson = await leasonModel.findByIdAndUpdate(
    lessonId,
    {
      assignment: {
        filePath, // Store the local file path
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : undefined
      }
    },
    { new: true }
  );

  if (!updatedLesson) {
    return res.status(404).json({ message: "Lesson not found" });
  }

  res.status(200).json({
    message: 'Assignment uploaded successfully',
    lesson: updatedLesson
  });
});

// Submit assignment
export const submitAssignment = asyncHandler(async (req, res, next) => {
  const userId = req.authuser._id;
  const { lessonId } = req.params;

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const lesson = await leasonModel.findById(lessonId);
  if (!lesson) {
    return res.status(404).json({ message: "Lesson not found" });
  }

  if (lesson.assignment?.dueDate && new Date() > lesson.assignment.dueDate) {
    return res.status(400).json({ message: "Assignment submission is past due date" });
  }

  const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
    folder: `leason/submissions/${lessonId}/${userId}`,
    use_filename: true,
    unique_filename: false,
    resource_type: 'auto'
  });

  const updatedLesson = await leasonModel.findByIdAndUpdate(
    lessonId,
    {
      $push: {
        submissions: {
          userId,
          file: { secure_url, public_id },
          submittedAt: new Date()
        }
      }
    },
    { new: true }
  );

  res.status(200).json({
    message: 'Assignment submitted successfully',
    lesson: updatedLesson
  });
});

// Grade assignment
export const gradeAssignment = asyncHandler(async (req, res, next) => {
  const { lessonId, submissionId } = req.params;
  const { mark, feedback } = req.body;

  if (!mark || mark < 0 || mark > 100) {
    return res.status(400).json({ message: "Valid mark (0-100) is required" });
  }

  const lesson = await leasonModel.findById(lessonId);
  if (!lesson) {
    return res.status(404).json({ message: "Lesson not found" });
  }

  const submission = lesson.submissions.id(submissionId);
  if (!submission) {
    return res.status(404).json({ message: "Submission not found" });
  }

  submission.mark = mark;
  submission.feedback = feedback;
  submission.status = 'graded';

  await lesson.save();

  res.status(200).json({
    message: 'Assignment graded successfully',
    lesson
  });
});

// Download assignment PDF
export const downloadAssignment = asyncHandler(async (req, res, next) => {
  const { lessonId } = req.params;
  const lesson = await leasonModel.findById(lessonId);
  
  console.log('Lesson:', lesson);
  console.log('Assignment:', lesson?.assignment);
  console.log('FilePath:', lesson?.assignment?.filePath);

  if (!lesson || !lesson.assignment || !lesson.assignment.filePath) {
    return res.status(404).json({ message: 'Assignment PDF not found' });
  }

  res.download(lesson.assignment.filePath);
});
