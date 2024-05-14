import express from "express";
import 'dotenv/config'
import cors from "cors"
import cookieParser from "cookie-parser";
import { connectDB } from "./DB/database.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import bodyParser from "body-parser";
const app = express();

const port = process.env.PORT ;
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

connectDB();
app.use(express.json({limit: "10mb"}))
app.use(express.urlencoded({extended: true, limit: "10mb"}))
app.use(bodyParser.json({ limit: '10mb' }));
app.use(cookieParser());

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    
})
import userRouter from "./routes/user.route.js";



// Using Routes
app.use("/api/v1/user",userRouter)

// app.use("uploads",express.static("uploads"))
app.use(errorMiddleware)