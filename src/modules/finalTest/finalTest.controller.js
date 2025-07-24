import { finalTestModel } from "../../../connections/models/finalTest.model.js";
import { submittedFinalTestModel } from "../../../connections/models/submittedFinalTest.model.js";
import { submittedAssignmentModel } from "../../../connections/models/submittedAssignment.model.js";
import { leasonModel } from "../../../connections/models/leason.model.js";
import { courseModel } from "../../../connections/models/course.model.js";
import { asyncHandler } from "../../utils/errorHandeling.js";
import cloudinary from "../../utils/cloudinaryConfigration.js";
import fs from 'fs';
 

export const createFinalTest = asyncHandler(async (req, res) => {
  try {
    const { role } = req.authuser;
    const { courseId } = req.params;

    if (role !== "Admin" && role !== "Instructor") {
      return res.status(403).json({
        message: "Unauthorized: Admin or Instructor access required"
      });
    }

    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const existingTest = await finalTestModel.findOne({ courseId });
    if (existingTest) {
      return res.status(400).json({
        message: "A final test already exists for this course"
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "finalTests",
      resource_type: "raw", // use "raw" for PDFs
      format: "pdf"
    });

    // Delete local file
    fs.unlinkSync(req.file.path);

    // Save to DB
    const finalTest = await finalTestModel.create({
      courseId,
      file: {
        url: result.secure_url,
        public_id: result.public_id
      }
    });

    res.status(201).json({
      message: "Final test created successfully",
      finalTest
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Upload failed",
      error: err.message
    });
  }
});


export const createFinalTestSubmission = asyncHandler(async (req, res) => {
  try {
    const { role } = req.authuser;

    const { courseId } = req.params;
    const userId = req.authuser._id;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Check if final test exists
    const finalTest = await finalTestModel.findOne({ courseId });
    if (!finalTest) {
      return res.status(404).json({ message: "Final test not found for this course" });
    }

    // Prevent duplicate submission
    const existingSubmission = await submittedFinalTestModel.findOne({
      userId,
      finalTestId: finalTest._id,
    });
    if (existingSubmission) {
      return res.status(400).json({
        message: "You have already submitted the final test for this course",
      });
    }

    // Get course lessons
    const lessons = await leasonModel.find({ courseId });
    const lessonIds = lessons.map((lesson) => lesson._id);

    // Get assignment submissions for those lessons
    const submissions = await submittedAssignmentModel.find({
      userId,
      lessonId: { $in: lessonIds },
    });

    // Check all lessons have submissions
    if (submissions.length !== lessons.length ^ role!='User') {
      return res.status(400).json({
        message: "You must submit and get grades for all course assignments before taking the final test",
      });
    }

    // Check all submissions are graded
    const ungradedSubmissions = submissions.filter(sub => sub.status !== "graded");
    if (ungradedSubmissions.length > 0) {
      return res.status(400).json({
        message: "All your assignments must be graded before taking the final test",
      });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "raw", // use raw for PDF and other non-media files
      folder: "finalTestSubmissions",
      format: "pdf",
    });

    // Delete local file
    fs.unlinkSync(req.file.path);

    // Save submission in DB
    const submission = await submittedFinalTestModel.create({
      userId,
      finalTestId: finalTest._id,
      file: {
        url: result.secure_url,
        public_id: result.public_id,
      },
      submittedAt: new Date(),
    });

    res.status(201).json({
      message: "Final test submission created successfully",
      submission,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Cloudinary upload error",
      error: err.message,
    });
  }
});

// Get all final test submissions (admin and instructor only)
export const reviewAllFinalTestSubmissions = asyncHandler(
  async (req, res, next) => {
    const { role } = req.authuser;

    if (role !== "Admin" && role !== "Instructor") {
      return res
        .status(403)
        .json({ message: "Unauthorized: Admin or Instructor access required" });
    }

    const submissions = await submittedFinalTestModel
      .find()
      .populate({
        path: "userId",
        select: "username email",
      })
      .populate({
        path: "finalTestId",
        select: "courseId dueDate",
        populate: {
          path: "courseId",
          select: "title imageurl",
        },
      });

    res.status(200).json({
      submissions: submissions.map(sub => ({
        ...sub.toObject(),
        reviewerName: sub.reviewerName || null,
        reviewerEmail: sub.reviewerEmail || null
      }))
    });
  }
);

// Grade a final test submission (admin and instructor only)
export const gradeFinalTestSubmission = asyncHandler(async (req, res, next) => {
  const { submissionId } = req.params;
  const { rating, feedback } = req.body;
  const { role, username, email } = req.authuser;

  if (role !== "Admin" && role !== "Instructor") {
    return res
      .status(403)
      .json({ message: "Unauthorized: Admin or Instructor access required" });
  }

  if (rating < 0 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 0 and 5" });
  }

  const submission = await submittedFinalTestModel.findById(submissionId);
  if (!submission) {
    return res.status(404).json({ message: "Submission not found" });
  }

  submission.rating = rating;
  if (feedback) submission.feedback = feedback;
  submission.status = "graded";
  submission.reviewerName = username;
  submission.reviewerEmail = email;
  await submission.save();

  // Get the updated submission with populated fields
  const updatedSubmission = await submittedFinalTestModel
    .findById(submissionId)
    .populate({
      path: "userId",
      select: "username email",
    })
    .populate({
      path: "finalTestId",
      select: "courseId dueDate",
      populate: {
        path: "courseId",
        select: "title imageurl",
      },
    });

  res.status(200).json({
    message: "Final test submission graded successfully",
    submission: updatedSubmission,
    reviewerName: username,
    reviewerEmail: email
  });
});

// Get final test file (for students, admins, and instructors)
import axios from "axios";

export const getFinalTestFile = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;
  const userId = req.authuser._id;
  const userRole = req.authuser.role;

  const finalTest = await finalTestModel.findOne({ courseId });
  if (!finalTest) {
    return res.status(404).json({ message: "Final test not found for this course" });
  }

  if (!finalTest.file || !finalTest.file.url) {
    return res.status(404).json({ message: "Final test file not found" });
  }

  // Admins & Instructors always allowed to download
  if (userRole === "Admin" || userRole === "Instructor") {
    const response = await axios.get(finalTest.file.url, { responseType: "arraybuffer" });

    res.setHeader("Content-Disposition", `attachment; filename=final-test.pdf`);
    res.setHeader("Content-Type", "application/pdf");

    return res.send(response.data);
  }

  // Check if user submitted and all assignments graded
  const lessons = await leasonModel.find({ courseId });
  if (!lessons || lessons.length === 0) {
    return res.status(404).json({ message: "No lessons found for this course" });
  }

  const lessonIds = lessons.map(lesson => lesson._id);
  const submissions = await submittedAssignmentModel.find({
    userId,
    lessonId: { $in: lessonIds },
  });

  if (submissions.length !== lessons.length) {
    const remaining = lessons.length - submissions.length;
    return res.status(400).json({
      message: `You must submit all assignments. ${remaining} remaining.`,
    });
  }

  const ungraded = submissions.filter(sub => sub.status !== "graded");
  if (ungraded.length > 0) {
    return res.status(400).json({
      message: `All assignments must be graded. ${ungraded.length} pending.`,
    });
  }

  // All checks passed, download from Cloudinary and return blob
  const response = await axios.get(finalTest.file.url, { responseType: "arraybuffer" });

  res.setHeader("Content-Disposition", `attachment; filename=final-test.pdf`);
  res.setHeader("Content-Type", "application/pdf");

  return res.send(response.data);
});



export const downloadStudentSubmission = asyncHandler(async (req, res, next) => {
  const { submissionId } = req.params;
  const { role } = req.authuser;

  if (role !== "Admin" && role !== "Instructor") {
    return res.status(403).json({
      message: "Unauthorized: Admin or Instructor access required",
    });
  }

  const submission = await submittedFinalTestModel
    .findById(submissionId)
    .populate({
      path: "userId",
      select: "username email",
    })
    .populate({
      path: "finalTestId",
      select: "courseId",
      populate: {
        path: "courseId",
        select: "title",
      },
    });

  if (!submission) {
    return res.status(404).json({ message: "Submission not found" });
  }

  if (!submission.file || !submission.file.url) {
    return res.status(404).json({ message: "Submission file not found" });
  }

  try {
    // Download file from Cloudinary
    const response = await axios({
      method: 'GET',
      url: submission.file.url,
      responseType: 'stream',
    });

    // Set headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${submission.userId.username}-final-submission.pdf"`
    );

    // Pipe file stream to response
    response.data.pipe(res);
  } catch (err) {
    console.error("Download error:", err.message);
    res.status(500).json({ message: "Failed to download the file" });
  }
});


export const getStudentFinalTestFeedback = async (req, res) => {
  try {
    const userId = req.authuser;

    // Find all final test submissions for this student with proper population
    const submissions = await submittedFinalTestModel
      .find({
        userId,
      })
      .populate("userId", "username email")
      .populate({
        path: "finalTestId",
        select: "courseId",
        populate: {
          path: "courseId",
          select: "title ",
        },
      });

    if (!submissions || submissions.length === 0) {
      return res.status(404).json({
        message: "No final test submissions found",
      });
    }

    // Return all submissions with their feedback and ratings
    return res.status(200).json({
      message: "Final test feedbacks retrieved successfully",
      submissions: submissions.map((submission) => {
        // Log the submission for debugging
        console.log("Raw submission:", submission);

        const submissionData = {
          id: submission._id,
          studentName: submission.userId?.name || "Unknown",
          studentEmail: submission.userId?.email || "Unknown",
          courseName:
            submission.finalTestId?.courseId?.title || "Unknown Course",
          courseId: submission.finalTestId?.courseId?._id || null,
          submittedAt: submission.submittedAt,
          status: submission.status || "pending",
          reviewerName: submission.reviewerName || null,
          reviewerEmail: submission.reviewerEmail || null
        };

        // Only include rating and feedback if the submission is graded
        if (submission.status === "graded") {
          submissionData.rating = submission.rating || "No Rating";
          submissionData.feedback =
            submission.feedback || "No feedback provided";
        } else {
          submissionData.rating = null;
          submissionData.feedback = null;
        }

        return submissionData;
      }),
    });
  } catch (error) {
    console.error("Error getting final test feedbacks:", error);
    return res.status(500).json({
      message: "Error getting final test feedbacks",
      error: error.message,
    });
  }
};






