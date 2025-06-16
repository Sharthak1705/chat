import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from "dotenv";
import { connectDB } from './lib/db.js';
import { app, server } from "./lib/socket.js";

import authRoute from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import callRoute from './routes/call.route.js'; 

dotenv.config();

const { PORT } = process.env;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));

app.use("/api/auth", authRoute);
app.use("/api/messages", messageRoutes);
app.use("/api/calls", callRoute); 

server.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
    connectDB();
});
