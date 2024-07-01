import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import { dbConnection } from "./db/dbConnection.js"
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRouter from "./routes/userRoutes.js"

dotenv.config()
const app = express()


app.use(
    cors(
        //     {
        //   origin: [process.env.FRONTEND_URL],
        //   method: ["GET", "POST", "DELETE", "PUT"],
        //   credentials: true,
        // }
    )
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"))

dbConnection()

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use("/api/v1/users", userRouter)



export default app;