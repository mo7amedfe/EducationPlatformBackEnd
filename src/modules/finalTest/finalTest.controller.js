import { finalTestModel } from "../../../connections/models/finalTest.model.js";
import { submittedFinalTestModel } from "../../../connections/models/submittedFinalTest.model.js";
import { submittedAssignmentModel } from "../../../connections/models/submittedAssignment.model.js";
import { leasonModel } from "../../../connections/models/leason.model.js";
import { courseModel } from "../../../connections/models/course.model.js";
import { asyncHandler } from "../../utils/errorHandeling.js";
import cloudinary from "../../utils/cloudinaryConfigration.js";


import fs from 'fs';
 

// Create a final test for a course (admin and instructor only)
// export const createFinalTest = asyncHandler(async (req, res, next) => {
//   const { role } = req.authuser;
//   const { courseId } = req.params;

//   if (role !== "Admin" && role !== "Instructor") {
//     return res
//       .status(403)
//       .json({ message: "Unauthorized: Admin or Instructor access required" });
//   }

//   // Check if course exists
//   const course = await courseModel.findById(courseId);
//   if (!course) {
//     return res.status(404).json({ message: "Course not found" });
//   }

//   // Check if final test already exists for this course
//   const existingTest = await finalTestModel.findOne({ courseId });
//   if (existingTest) {
//     return res
//       .status(400)
//       .json({ message: "A final test already exists for this course" });
//   }

//   if (!req.file) {
//     return res.status(400).json({ message: "No file uploaded" });
//   }

//   // Upload PDF to Cloudinary using a Promise
//   let cloudinaryResult;
//   try {
//     cloudinaryResult = await new Promise((resolve, reject) => {
//       const uploadStream = cloudinary.uploader.upload_stream(
//         {
//           resource_type: "raw",
//           folder: "finalTests",
//           format: "pdf",
//           type: "upload",
//         },
//         (error, result) => {
//           if (error) return reject(error);
//           resolve(result);
//         }
//       );
//       uploadStream.end(req.file.buffer);
//     });
//   } catch (err) {
//     return res
//       .status(500)
//       .json({ message: "Cloudinary upload error", error: err.message });
//   }

//   // Save the file info in the database
//   const finalTest = await finalTestModel.create({
//     courseId,
//     file: {
//       url: cloudinaryResult.secure_url,
//       public_id: cloudinaryResult.public_id,
//     },
//   });

//   res
//     .status(201)
//     .json({ message: "Final test created successfully", finalTest });
// });

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

// Create a final test submission
// export const createFinalTestSubmission = asyncHandler(
//   async (req, res, next) => {
//     const { courseId } = req.params;
//     const userId = req.authuser._id;

//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     // Get the final test for the course
//     const finalTest = await finalTestModel.findOne({ courseId });
//     if (!finalTest) {
//       return res
//         .status(404)
//         .json({ message: "Final test not found for this course" });
//     }

//     // Check if student already submitted
//     const existingSubmission = await submittedFinalTestModel.findOne({
//       userId,
//       finalTestId: finalTest._id,
//     });
//     if (existingSubmission) {
//       return res.status(400).json({
//         message: "You have already submitted the final test for this course",
//       });
//     }

//     // Get all lessons for the course
//     const lessons = await leasonModel.find({ courseId });
//     const lessonIds = lessons.map((lesson) => lesson._id);

//     // Check if all assignments are submitted and graded
//     const submissions = await submittedAssignmentModel.find({
//       userId,
//       lessonId: { $in: lessonIds },
//     });

//     // Check if all lessons have submissions
//     if (submissions.length !== lessons.length) {
//       return res.status(400).json({
//         message:
//           "You must submit and get grades for all course assignments before taking the final test",
//       });
//     }

//     // Check if all submissions are graded
//     const ungradedSubmissions = submissions.filter(
//       (sub) => sub.status !== "graded"
//     );
//     if (ungradedSubmissions.length > 0) {
//       return res.status(400).json({
//         message:
//           "All your assignments must be graded before taking the final test",
//       });
//     }

//     // Upload PDF to Cloudinary
//     let cloudinaryResult;
//     try {
//       cloudinaryResult = await cloudinary.uploader.upload_stream(
//         {
//           resource_type: "auto",
//           folder: "finalTestSubmissions",
//           format: "pdf",
//         },
//         async (error, result) => {
//           if (error) {
//             return res
//               .status(500)
//               .json({ message: "Cloudinary upload failed", error });
//           }
//           // Create the final test submission
//           const submission = await submittedFinalTestModel.create({
//             userId,
//             finalTestId: finalTest._id,
//             file: { url: result.secure_url, public_id: result.public_id },
//             submittedAt: new Date(),
//           });
//           return res.status(201).json({
//             message: "Final test submission created successfully",
//             submission,
//           });
//         }
//       );
//       cloudinaryResult.end(req.file.buffer);
//     } catch (err) {
//       return res
//         .status(500)
//         .json({ message: "Cloudinary upload error", error: err.message });
//     }
//   }
// );
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

    res.status(200).json({ submissions });
  }
);

// Grade a final test submission (admin and instructor only)
export const gradeFinalTestSubmission = asyncHandler(async (req, res, next) => {
  const { submissionId } = req.params;
  const { rating, feedback } = req.body;
  const { role } = req.authuser;

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
  });
});

// Get final test file (for students, admins, and instructors)
export const getFinalTestFile = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;
  const userId = req.authuser._id;
  const userRole = req.authuser.role;

  // Get the final test
  const finalTest = await finalTestModel.findOne({ courseId });
  if (!finalTest) {
    return res
      .status(404)
      .json({ message: "Final test not found for this course" });
  }

  // If admin or instructor, always send the file if it exists
  if (userRole === "Admin" || userRole === "Instructor") {
    if (!finalTest.file || !finalTest.file.url) {
      return res.status(404).json({ message: "Final test file not found" });
    }
    return res.status(200).json({ url: finalTest.file.url });
  }

  // Get all lessons for the course
  const lessons = await leasonModel.find({ courseId });
  if (!lessons || lessons.length === 0) {
    return res
      .status(404)
      .json({ message: "No lessons found for this course" });
  }

  const lessonIds = lessons.map((lesson) => lesson._id);

  // Check if all assignments are submitted and graded
  const submissions = await submittedAssignmentModel.find({
    userId,
    lessonId: { $in: lessonIds },
  });

  // Check if all lessons have submissions
  if (submissions.length !== lessons.length) {
    const missingSubmissions = lessons.length - submissions.length;
    return res.status(400).json({
      message: `You must submit all course assignments before accessing the final test. ${missingSubmissions} assignment(s) remaining.`,
      remainingAssignments: missingSubmissions,
      totalAssignments: lessons.length,
      submittedAssignments: submissions.length,
    });
  }

  // Check if all submissions are graded
  const ungradedSubmissions = submissions.filter(
    (sub) => sub.status !== "graded"
  );
  if (ungradedSubmissions.length > 0) {
    return res.status(400).json({
      message: `All your assignments must be graded before accessing the final test. ${ungradedSubmissions.length} assignment(s) pending review.`,
      pendingReviews: ungradedSubmissions.length,
      totalAssignments: lessons.length,
    });
  }

  // Check if file exists
  if (!finalTest.file || !finalTest.file.url) {
    return res.status(404).json({ message: "Final test file not found" });
  }

  // Return the Cloudinary URL as JSON
  res.status(200).json({ url: finalTest.file.url });
});

// Download student's final test submission (admin and instructor only)
export const downloadStudentSubmission = asyncHandler(
  async (req, res, next) => {
    const { submissionId } = req.params;
    const { role } = req.authuser;

    if (role !== "Admin" && role !== "Instructor") {
      return res
        .status(403)
        .json({ message: "Unauthorized: Admin or Instructor access required" });
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

    // Return the Cloudinary URL as JSON
    res.status(200).json({ url: submission.file.url });
  }
);

export const getStudentFinalTestFeedback = async (req, res) => {
  try {
    const userId = req.authuser;

    // Find all final test submissions for this student with proper population
    const submissions = await submittedFinalTestModel
      .find({
        userId,
      })
      .populate("userId", "name email")
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

// Update a final test (admin and instructor only)
export const updateFinalTest = asyncHandler(async (req, res, next) => {
  const { role } = req.authuser;
  const { courseId } = req.params;

  if (role !== "Admin" && role !== "Instructor") {
    return res
      .status(403)
      .json({ message: "Unauthorized: Admin or Instructor access required" });
  }

  // Check if course exists
  const course = await courseModel.findById(courseId);
  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  // Check if final test exists
  const existingTest = await finalTestModel.findOne({ courseId });
  if (!existingTest) {
    return res
      .status(404)
      .json({ message: "Final test not found for this course" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // Update the final test with new file
  existingTest.file = {
    url: req.file.url,
    public_id: req.file.public_id,
  };
  await existingTest.save();

  res
    .status(200)
    .json({
      message: "Final test updated successfully",
      finalTest: existingTest,
    });
});

// Delete a final test (admin and instructor only)
export const deleteFinalTest = asyncHandler(async (req, res, next) => {
  const { role } = req.authuser;
  const { courseId } = req.params;

  if (role !== "Admin" && role !== "Instructor") {
    return res
      .status(403)
      .json({ message: "Unauthorized: Admin or Instructor access required" });
  }

  // Check if course exists
  const course = await courseModel.findById(courseId);
  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  // Check if final test exists
  const existingTest = await finalTestModel.findOne({ courseId });
  if (!existingTest) {
    return res
      .status(404)
      .json({ message: "Final test not found for this course" });
  }

  // Check if there are any submissions for this final test
  const submissions = await submittedFinalTestModel.find({
    finalTestId: existingTest._id,
  });
  if (submissions.length > 0) {
    return res.status(400).json({
      message:
        "Cannot delete final test. There are existing submissions for this test.",
      submissionCount: submissions.length,
    });
  }

  // Delete the final test
  await finalTestModel.findByIdAndDelete(existingTest._id);

  res.status(200).json({ message: "Final test deleted successfully" });
});

// Get final test info for a course (admin and instructor only)
export const getFinalTestInfo = asyncHandler(async (req, res, next) => {
  const { role } = req.authuser;
  const { courseId } = req.params;

  if (role !== "Admin" && role !== "Instructor") {
    return res
      .status(403)
      .json({ message: "Unauthorized: Admin or Instructor access required" });
  }

  // Check if course exists
  const course = await courseModel.findById(courseId);
  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  // Get final test info
  const finalTest = await finalTestModel.findOne({ courseId });
  if (!finalTest) {
    return res
      .status(404)
      .json({ message: "Final test not found for this course" });
  }

  // Get submission count
  const submissionCount = await submittedFinalTestModel.countDocuments({
    finalTestId: finalTest._id,
  });

  res.status(200).json({
    message: "Final test info retrieved successfully",
    finalTest: {
      id: finalTest._id,
      courseId: finalTest.courseId,
      hasFile: !!finalTest.file,
      createdAt: finalTest.createdAt,
      submissionCount,
    },
  });
});
