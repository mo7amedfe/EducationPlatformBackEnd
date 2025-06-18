import { pythonAdvancedExamModel } from "../../../connections/models/finalexam/pythonAdvancedExam.js";
import { pythonExamModel } from "../../../connections/models/finalexam/pythonExam.js";
import { scratch3ExamModel } from "../../../connections/models/finalexam/scratch3Exam.js";
import { scratchJExamModel } from "../../../connections/models/finalexam/scratchJExam.js";
import {  leasonModel } from "../../../connections/models/leason.model.js";
import { placementTestModel } from "../../../connections/models/palcemetTest.model.js";
import { userModel } from "../../../connections/models/user.model.js";
import { asyncHandler } from "../../utils/errorHandeling.js";

function getGrade(score, totalQuestions) {
  const percentage = (score / totalQuestions) * 100;

  if (percentage >= 97) return "A+";
  if (percentage >= 90) return "A";
  if (percentage >= 87) return "B+";
  if (percentage >= 80) return "B";
  if (percentage >= 77) return "C+";
  if (percentage >= 70) return "C";
  if (percentage >= 60) return "D+";
  if (percentage >= 50) return "D";
  return "F";
}

const paythonQuestions = [
  {
    id: 1,
    question: "10 + 1 = ?",
    choices: ["1", "2", "3", "4"],
    correctAnswer: "2",
  },
  {
    id: 2,
    question: "2 + 2 = ?",
    choices: ["3", "4", "5", "6"],
    correctAnswer: "4",
  },
  {
    id: 3,
    question: "4 + 4 = ?",
    choices: ["6", "7", "8", "9"],
    correctAnswer: "8",
  },
  {
    id: 4,
    question: "5 + 5 = ?",
    choices: ["10", "11", "12", "13"],
    correctAnswer: "10",
  },
];

const scratchJouniorQuestions = [
  {
    id: 1,
    question: "20 + 1 = ?",
    choices: ["1", "2", "3", "4"],
    correctAnswer: "2",
  },
  {
    id: 2,
    question: "2 + 2 = ?",
    choices: ["3", "4", "5", "6"],
    correctAnswer: "4",
  },
  {
    id: 3,
    question: "4 + 4 = ?",
    choices: ["6", "7", "8", "9"],
    correctAnswer: "8",
  },
  {
    id: 4,
    question: "5 + 5 = ?",
    choices: ["10", "11", "12", "13"],
    correctAnswer: "11",
  },
];

const scratch3Questions = [
  {
    id: 1,
    question: "3 + 1 = ?",
    choices: ["1", "2", "3", "4"],
    correctAnswer: "2",
  },
  {
    id: 2,
    question: "2 + 2 = ?",
    choices: ["3", "4", "5", "6"],
    correctAnswer: "4",
  },
  {
    id: 3,
    question: "4 + 4 = ?",
    choices: ["6", "7", "8", "9"],
    correctAnswer: "8",
  },
  {
    id: 4,
    question: "5 + 5 = ?",
    choices: ["10", "11", "12", "13"],
    correctAnswer: "15",
  },
];
const pythonAdvancedQuestions = [
  {
    id: 1,
    question: "40 + 1 = ?",
    choices: ["1", "2", "3", "4"],
    correctAnswer: "2",
  },
  {
    id: 2,
    question: "2 + 2 = ?",
    choices: ["3", "4", "5", "6"],
    correctAnswer: "4",
  },
  {
    id: 3,
    question: "4 + 4 = ?",
    choices: ["6", "7", "8", "9"],
    correctAnswer: "8",
  },
  {
    id: 4,
    question: "5 + 5 = ?",
    choices: ["10", "11", "12", "13"],
    correctAnswer: "20",
  },
];

// // ===============  show  pyhon quistion ====================//







// // ===============  show  pyhon quistion ====================//

export const showPythonQs = asyncHandler(async (req, res, next) => {
  const lessons = await leasonModel.find();

  // اجعل العدد المطلوب من الـ assignments = عدد الدروس
  const requiredAssignments = lessons.length;

  // تحقق إذا كان أي درس فيه عدد assignments أكبر من عدد الدروس
  const anyLessonHasAssignments = lessons.some(
    (lesson) => lesson.assignments && lesson.assignments.length >= requiredAssignments
  );
console.log(lessons[0].assignments.length);

  

  if (anyLessonHasAssignments) {
    const qs = paythonQuestions.map((q) => ({
      id: q.id,
      question: q.question,
      choices: q.choices,
    }));

    res.json({
      message: "Questions loaded",
      paythonQuestions: qs,
    });
  } else {
    res.json({ message: "Please upload all assignments first" });
  }
});




// ===============  show  scratch jounior quistion ====================//
export const showScratchJouniorQs = asyncHandler(async (req, res, next) => {
  const lessons = await leasonModel.find();

  // تحقق إذا كان أي درس فيه أكثر من 1 assignment
  const anyLessonHasAssignments = lessons.some(
    (lesson) => lesson.assignments && lesson.assignments.length >= lessons.length
  );

  if (anyLessonHasAssignments) {
    const qs = scratchJouniorQuestions.map((q) => ({
      id: q.id,
      question: q.question,
      choices: q.choices,
    }));

    res.json({
      message: "Questions loaded",
      scratchJouniorQuestions: qs,
    });
  } else {
    res.json({ message: "Please upload all assignments first" });
  }
});



// // ===============  show  scratch 3 quistion ====================//
export const showScratch3Qs = asyncHandler(async (req, res, next) => {
  const lessons = await leasonModel.find();

  // تحقق إذا كان أي درس فيه أكثر من 1 assignment
  const anyLessonHasAssignments = lessons.some(
    (lesson) => lesson.assignments && lesson.assignments.length >= lessons.length
  );

  if (anyLessonHasAssignments) {
    const qs = scratch3Questions.map((q) => ({
      id: q.id,
      question: q.question,
      choices: q.choices,
    }));

    res.json({
      message: "Questions loaded",
      scratch3Questions: qs,
    });
  } else {
    res.json({ message: "Please upload all assignments first" });
  }
});


// // ===============  show  python advanced quistion ====================//
export const showpythonAdvQs = asyncHandler(async (req, res, next) => {
  const lessons = await leasonModel.find();

  // تحقق إذا كان أي درس فيه أكثر من 1 assignment
  const anyLessonHasAssignments = lessons.some(
    (lesson) => lesson.assignments && lesson.assignments.length >= lessons.length
  );

  if (anyLessonHasAssignments) {
    const qs = pythonAdvancedQuestions.map((q) => ({
      id: q.id,
      question: q.question,
      choices: q.choices,
    }));

    res.json({
      message: "Questions loaded",
      pythonAdvancedQuestions: qs,
    });
  } else {
    res.json({ message: "Please upload all assignments first" });
  }
});








// // ===============  show  pyhon quistion ====================//

// export const showPythonQs = asyncHandler(async (req, res, next) => {
//   const qs = paythonQuestions.map((q) => ({
//     id: q.id,
//     question: q.question,
//     choices: q.choices,
//   }));
//   res.json({ message: "Questions loaded", paythonQuestions: qs });

// });




// ===============  show  scratch jounior quistion ====================//
// export const showScratchJouniorQs = asyncHandler(async (req, res, next) => {
//   const qs = scratchJouniorQuestions.map((q) => ({
//     id: q.id,
//     question: q.question,
//     choices: q.choices,
//   }));
//   res.json({ message: "Questions loaded", scratchJouniorQuestions: qs });
// });

// // ===============  show  scratch 3 quistion ====================//
// export const showScratch3Qs = asyncHandler(async (req, res, next) => {
//   const qs = scratch3Questions.map((q) => ({
//     id: q.id,
//     question: q.question,
//     choices: q.choices,
//   }));
//   res.json({ message: "Questions loaded", scratch3Questions: qs });
// });

// // ===============  show  python advanced quistion ====================//
// export const showpythonAdvQs = asyncHandler(async (req, res, next) => {
//   const qs = pythonAdvancedQuestions.map((q) => ({
//     id: q.id,
//     question: q.question,
//     choices: q.choices,
//   }));
//   res.json({ message: "Questions loaded", pythonAdvancedQuestions: qs });
// });

// // ===================  submit python  ====================//
export const submitPython = asyncHandler(async (req, res, next) => {
  const { student_id, answers } = req.body;

  let score = 0;

  // مقارنة الإجابات
  paythonQuestions.forEach((q) => {
    const studentAnswer = answers.find((ans) => ans.id === q.id);
    if (studentAnswer && studentAnswer.answer === q.correctAnswer) {
      score++;
    }
  });

  // حساب التقييم
  const grade = getGrade(score, paythonQuestions.length);

  // حفظ النتيجة في قاعدة البيانات
  const examResult = await pythonExamModel.create({
    student_Id: student_id,
    score,
  });

  res.json({
    message: "Test submitted successfully",
    score,
    grade,
  });
});

// // ===================  submit scratch j  ====================//
export const submitSJ = asyncHandler(async (req, res, next) => {
  const { student_id, answers } = req.body;

  let score = 0;

  // مقارنة الإجابات
  scratchJouniorQuestions.forEach((q) => {
    const studentAnswer = answers.find((ans) => ans.id === q.id);
    if (studentAnswer && studentAnswer.answer === q.correctAnswer) {
      score++;
    }
  });

  // حساب التقييم
  const grade = getGrade(score, scratchJouniorQuestions.length);

  // حفظ النتيجة في قاعدة البيانات
  const examResult = await scratchJExamModel.create({
    student_Id: student_id,
    score,
  });

  res.json({
    message: "Test submitted successfully",
    score,
    grade,
  });
});

// // ===================  submit scratch 3  ====================//
export const submitS3 = asyncHandler(async (req, res, next) => {
  const { student_id, answers } = req.body;

  let score = 0;

  // مقارنة الإجابات
  scratch3Questions.forEach((q) => {
    const studentAnswer = answers.find((ans) => ans.id === q.id);
    if (studentAnswer && studentAnswer.answer === q.correctAnswer) {
      score++;
    }
  });

  // حساب التقييم
  const grade = getGrade(score, scratch3Questions.length);

  // حفظ النتيجة في قاعدة البيانات
  const examResult = await scratch3ExamModel.create({
    student_Id: student_id,
    score,
  });

  res.json({
    message: "Test submitted successfully",
    score,
    grade,
  });
});

// // ===================  submit python advanced  ====================//
export const submitpyAdv = asyncHandler(async (req, res, next) => {
  const { student_id, answers } = req.body;

  let score = 0;

  // مقارنة الإجابات
  pythonAdvancedQuestions.forEach((q) => {
    const studentAnswer = answers.find((ans) => ans.id === q.id);
    if (studentAnswer && studentAnswer.answer === q.correctAnswer) {
      score++;
    }
  });

  // حساب التقييم
  const grade = getGrade(score, pythonAdvancedQuestions.length);

  // حفظ النتيجة في قاعدة البيانات
  const examResult = await pythonAdvancedExamModel.create({
    student_Id: student_id,
    score,
  });

  res.json({
    message: "Test submitted successfully",
    score,
    grade,
  });
});







