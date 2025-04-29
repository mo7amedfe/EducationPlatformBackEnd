import mongoose, { Schema } from 'mongoose'

const plasementTestSchema = new Schema(
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

export const placementTestModel = mongoose.model('PlacementTest', plasementTestSchema)