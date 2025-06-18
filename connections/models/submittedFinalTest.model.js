import mongoose from 'mongoose';

const submittedFinalTestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    finalTestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FinalTest',
      required: true
    },
    file: {
      filePath: String
    },
    rating: {
      type: Number,
      min: 0,
      max: 5
    },
    feedback: String,
    status: {
      type: String,
      enum: ['pending', 'graded', 'returned'],
      default: 'pending'
    },
    submittedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Add a compound index to ensure a student can only submit once per final test
submittedFinalTestSchema.index({ userId: 1, finalTestId: 1 }, { unique: true });

export const submittedFinalTestModel = mongoose.model('SubmittedFinalTest', submittedFinalTestSchema);
