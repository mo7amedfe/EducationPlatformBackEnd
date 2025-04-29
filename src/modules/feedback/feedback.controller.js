import { feedbackModel } from '../../../connections/models/feedback.model.js'
import { userModel } from '../../../connections/models/user.model.js'
import { asyncHandler } from '../../utils/errorHandeling.js'

//============================== send message =========================
export const sendMessage = asyncHandler(async (req, res, next) => {
    const { content, sendTo } = req.body
    const isUserExists = await userModel.findById(sendTo)
    if (!isUserExists) {
      return res.status(400).json({ message: 'not found' })
    }
    const message = new feedbackModel({ content, sendTo })
    await message.save()
    res.status(201).json({ messsage: 'Done', message })
  })

//============================ get user messages ==================
export const getUserMessages = asyncHandler(async (req, res, next) => {
    const { _id } =req.authuser
    const messages = await feedbackModel.find({ sendTo: _id })
    if (messages.length) {
      return res.status(200).json({ messsage: 'Done', messages })
    }
    res.status(200).json({ messsage: 'empty inbox' })
  })

//============================ delete message ==================
export const deleteMessage = asyncHandler(async (req, res, next) => {
    const { _id } =req.authuser
    const message = await feedbackModel.findOneAndDelete({sendTo:_id})
    
    if (message) {
      return res.status(200).json({ messsage: ' delete frrdback Done' })
    }
    res.status(401).json({ messsage: 'unAuthorized' })
  })
