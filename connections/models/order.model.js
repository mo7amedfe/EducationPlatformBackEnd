import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courses: [
      {
        courseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        selectedSchedule: {
          day: {
            type: String,
            required: true,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
          },
          time: {
            type: String,
            required: true
          }
        }
      }
    ],
    total: {
      type: Number,
      default: 0,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["cash", "card"],
    },
  },
  { timestamps: true }
);

export const orderModel = mongoose.model("Order", orderSchema);
