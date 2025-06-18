// schedule.model.js
import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  time: {
    type: String,
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  }
}, {
  timestamps: true
});

export const scheduleModel = mongoose.model('Schedule', scheduleSchema); // ✅ الاسم هو "Schedule"
