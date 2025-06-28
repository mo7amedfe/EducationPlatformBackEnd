import express from 'express';
const app = express();
import { config } from 'dotenv';
import { initapp } from './src/initapp.js';
config();

// Initialize the app asynchronously
const startApp = async () => {
  try {
    await initapp(app, express);
  } catch (error) {
    console.error('Error during app initialization:', error);
  }
};

startApp();

export default app;
