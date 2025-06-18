import mongoose, { Schema } from 'mongoose'

const scratch3ExamSchema = new Schema(
  {

    student_Id:{
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    score: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    
  },
  {
    timestamps: true,
  },
)

export const scratch3ExamModel = mongoose.model('scratch3Exam', scratch3ExamSchema)