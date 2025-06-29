import express from "express";
const app = express();
import { config } from "dotenv";
import { initapp } from "./src/initapp.js";
import connectDB from './connections/dbconnection.js'; // حسب مكان الملف
config();
const startServer = async () => {
    await connectDB(); // ✅ اتصل قبل أي استخدام للـ Models
    app.listen(process.env.port, () => {
      console.log(`🚀 Server is running on ${process.env.port}`);
    });
  };
  
  startServer();
initapp(app, express);
export default app;
