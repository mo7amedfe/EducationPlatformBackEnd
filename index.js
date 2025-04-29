import express from 'express'
const app = express()
import { config } from 'dotenv'
import { initapp } from './src/initapp.js'
import cors from 'cors';

config()
initapp(app,express)
    export default app;



