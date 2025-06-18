import mongoose from 'mongoose';

const finalTestSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      unique: true // Each course can have only one final test
    },
    file: {
      filePath: String,
      title: String,
      description: String
    },
    dueDate: {
      type: Date,
      required: false
    }
  },
  {
    timestamps: true
  }
);

export const finalTestModel = mongoose.model('FinalTest', finalTestSchema); 