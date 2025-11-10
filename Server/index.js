import "dotenv/config";
import express from "express";
import cors from 'cors';
import {app,server} from './config/socket.js'
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRouter.js";
import messageRouter from "./routes/messageRouter.js";
const PORT = 3005;

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}
));
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb",extended: true }));
app.use(cookieParser())

connectDB().then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => console.error("❌ MongoDB connection error:", err));


app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);



server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});