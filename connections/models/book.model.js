import mongoose, { Schema } from 'mongoose'

const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    desc:{
        type:String,
        required:true
    },    
    pdfurl: {
        secure_url: String,
        public_id: String,
    },
    imageurl: {
        secure_url: String,
        public_id: String,
    },
    uploadedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
)

export const bookModel = mongoose.model('Book', bookSchema)
