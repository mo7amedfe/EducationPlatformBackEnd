import { placementTestModel } from "../../../connections/models/palcemetTest.model.js";
import { userModel } from "../../../connections/models/user.model.js";
import { asyncHandler } from "../../utils/errorHandeling.js";





const questions = [
    {
      id: 1,
      question: '1 + 1 = ?',
      choices: ['1', '2', '3','4'],
      correctAnswer: '2'
    },
    {
      id: 2,
      question: '2 + 2 = ?',
      choices: ['3', '4', '5','6'],
      correctAnswer: '4'
    },
    {
      id: 3,
      question: '4 + 4 = ?',
      choices: ['6', '7', '8','9'],
      correctAnswer: '8'
    },
    {
      id: 4,
      question: '5 + 5 = ?',
      choices: ['10', '11', '12','13'],
      correctAnswer: '10'
    },
  ];
  


// // ===============  show quistion ====================// 

  export const showQS = asyncHandler(async (req, res, next) => {
    const qs = questions.map(q => ({
      id: q.id,
      question: q.question,
      choices: q.choices
    }));
    res.json({ message: 'Questions loaded', questions: qs });
  });
  


// // ===================  submit test  ====================//

  export const submit = asyncHandler(async (req, res, next) => {
    const { student_id, answers } = req.body;
  
    let score = 0;
  
    // مقارنة الإجابات
    questions.forEach(q => {
      const studentAnswer = answers.find(ans => ans.id === q.id);
      if (studentAnswer && studentAnswer.answer === q.correctAnswer) {
        score++;
      }
    });
  
    // حفظ النتيجة في قاعدة البيانات
    const student = await userModel.findByIdAndUpdate(
      student_id,
      { score },
      { new: true }
    );
  
    res.json({ message: 'Test submitted', score });
  });
  














// // ثابت فيه الأسئلة والإجابات الصحيحة



// const questions = [
//     { id: 1, question: '1 + 1 = ?', answer: '2' },
//     { id: 2, question: '2 + 2 = ?', answer: '4' },
//     { id: 3, question: '4 + 4 = ?', answer: '8' },
//     { id: 4, question: '5 + 5 = ?', answer: '10' },
//   ];
  


// // ===============  show quistion ====================// 
// export const showQS = asyncHandler(async(req,res,next)=>{
//     const qs = questions.map(q => ({ id: q.id, question: q.question }));
//     res.json({ message: 'Questions loaded', questions: qs });
// })


// // ===================  submit test  ====================//
// export const submit = asyncHandler(async(req,res,next)=>{
//     const { student_id, answers } = req.body;
  
//     let score = 0;
  
//     // مقارنة الإجابات
//     questions.forEach(q => {
//       const studentAnswer = answers.find(ans => ans.id === q.id);
//       if (studentAnswer && studentAnswer.answer === q.answer) {
//         score++;
//       }
//     });
  

//     // save in DB
//     const student = await userModel.findByIdAndUpdate(
//         student_id,
//         { score },
//         { new: true }
//       );
  
//     res.json({ message: 'Test submitted', score });
// })















//   router.get('/questions', (req, res) => {
//     const qs = questions.map(q => ({ id: q.id, question: q.question }));
//     res.json({ message: 'Questions loaded', questions: qs });
//   });
  
  // POST /test/submit — استقبال إجابات الطالب
//   router.post('/submit', async (req, res) => {
//     const { studentName, answers } = req.body;
  
//     let score = 0;
  
//     // مقارنة الإجابات
//     questions.forEach(q => {
//       const studentAnswer = answers.find(ans => ans.id === q.id);
//       if (studentAnswer && studentAnswer.answer === q.answer) {
//         score++;
//       }
//     });
  
//     // حفظ النتيجة في قاعدة البيانات
//     const result = new ResultModel({ studentName, score });
//     await result.save();
  
//     res.json({ message: 'Test submitted', score });
//   });