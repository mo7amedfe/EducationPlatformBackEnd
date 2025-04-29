import mongoose, { Schema } from 'mongoose'



const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageurl: {secure_url:String,public_id:String},

});
export const courseModel = mongoose.model('courses', courseSchema)