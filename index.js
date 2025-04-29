import express from "express";
import { initapp } from "./utils/initapp.js";
import serverless from "serverless-http";

const app = express();
initapp(app, express);

export const handler = serverless(app);
