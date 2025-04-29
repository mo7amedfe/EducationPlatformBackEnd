import mongoose from 'mongoose'

export const connectionDB = async () => {
  return await mongoose
    .connect("mongodb://localhost:27017/grad-projecte")
    .then((res) => console.log('DB connection success'))
    .catch((err) => console.log('DB connection Fail', err))
} 