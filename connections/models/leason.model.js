import mongoose from 'mongoose';

const leasonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    video: {
      secure_url: String,
      public_id: String,
      duration: Number,
      format: String
    },
    assignment: {
      secure_url: String,
      public_id: String,
      filePath: String,
      title: String,
      description: String,
      dueDate: Date
    },
    submissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubmittedAssignment' }]
  },
  {
    timestamps: true
  }
);

export const leasonModel = mongoose.model('Leason', leasonSchema);
