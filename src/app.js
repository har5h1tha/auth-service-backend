import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRouter from './routers/auth.router.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use('/api/user',authRouter)

connectDB()

export default app;