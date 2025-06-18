import mongoose, { Schema } from 'mongoose';


const assigmarkSchema = new mongoose.Schema(
  {
  
 
  
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true
          
        },

  },

  {
    timestamps: true
  }
);

export const AssignMarkModel = mongoose.model('AssignMark', assigmarkSchema);
