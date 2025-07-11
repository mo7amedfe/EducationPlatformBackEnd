import mongoose from 'mongoose';

const submittedAssignmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Leason',
      required: true
    },
    file: {
      url: String,
      public_id: String,
      filePath: String
    },
    mark: {
      type: Number,
      min: 0,
      max: 100
    },
    rating: {
      type: Number,
      min: 0,
      max: 5
    },
    feedback: String,
    submittedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'graded', 'returned'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

export const submittedAssignmentModel = mongoose.model('SubmittedAssignment', submittedAssignmentSchema);
