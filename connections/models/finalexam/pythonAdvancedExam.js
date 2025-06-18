import mongoose, { Schema } from 'mongoose'

const pythonAdvancedExamSchema = new Schema(
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

export const pythonAdvancedExamModel = mongoose.model('pythonAdvancedExam', pythonAdvancedExamSchema)