import mongoose, { Schema } from 'mongoose'

const pythonExamSchema = new Schema(
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

export const pythonExamModel = mongoose.model('pythonExam', pythonExamSchema)