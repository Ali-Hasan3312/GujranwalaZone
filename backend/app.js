import express from "express"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser";
import cors from "cors"
const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({limit: "10mb"}))
app.use(express.urlencoded({extended: true, limit: "10mb"}))
app.use(bodyParser.json({ limit: '10mb' }));
app.use(cookieParser());

// import routes

import { productRouter } from "./routes/product.route.js"
import { userRouter } from "./routes/user.route.js";
app.use("/api/v1", productRouter);
app.use("/api/v1", userRouter)

export {app}