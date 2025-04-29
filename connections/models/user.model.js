
import mongoose, { Schema } from 'mongoose'
import Joi from 'joi'
const { boolean } = Joi;


const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
  
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ['female', 'male', 'not specified'],
      default: 'not specified',
    },

    profile_pic: {secure_url:String,public_id:String},
    cover_pic:[{secure_url:String,public_id:String}],
    score: {
      type: Number || undefined,
      default: undefined,
    },

    // TakePlacementTest: {type:Boolean,default:false},
    // level:{type:String,default:null}
  },
  {
    timestamps: true,
  },
)

export const userModel = mongoose.model('User', userSchema)
