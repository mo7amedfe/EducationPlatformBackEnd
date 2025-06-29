import mongoose from 'mongoose'

// export const connectionDB = async () => {
//   return await mongoose
//     .connect("mongodb://localhost:27017/grad-projecte")
//     .then((res) => console.log('DB connection success'))
//     .catch((err) => console.log('DB connection Fail', err))
// } 

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      serverSelectionTimeoutMS: 10000,
      // bufferCommands: false,
      dbName: 'test' // ✅ مهم تحدد اسم الداتا بيز لو مش محطوط في URI
    });

    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};
export default connectDB