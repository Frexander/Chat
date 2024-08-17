import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import cookieParser from "cookie-parser";

import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cookieParser());

app.use(express.json());

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)

app.listen(3000, () => {
    console.log("Server running on port 3000");
});



