import express from 'express';
const app = express();
import { config } from 'dotenv';
import { initapp } from './src/initapp.js';
config();


initapp(app, express)
  .catch((err) => {
    console.error('Error during app initialization:', err);
  });

export default app;
