import express from 'express';
const app = express();
import cookieParser from 'cookie-parser';
import messageRoutes from './routes/message.route.js';
import cors from 'cors';
import dotenv from "dotenv";
import { connectDB } from './lib/db.js';
import authRoute from './routes/auth.route.js';
dotenv.config();

const {PORT} = process.env;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}))
app.use("/api/auth",authRoute);
app.use("/api/messages", messageRoutes);

app.listen(PORT,() =>{
    console.log(`Server is running on port:${PORT}`);
   connectDB();
})