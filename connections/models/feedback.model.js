import mongoose, { Schema } from 'mongoose'

const feedbackSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    sendTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
)

export const feedbackModel = mongoose.model('Feedback', feedbackSchema)
