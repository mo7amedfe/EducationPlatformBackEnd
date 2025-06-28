import express from 'express'
const app = express()
import { config } from 'dotenv'
import { initapp } from './src/initapp.js'
config()
initapp(app,express)
    export default app;



