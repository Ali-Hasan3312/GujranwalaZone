import express from "express";
import { config } from "dotenv";
import cors from "cors"
import cookieParser from "cookie-parser";
import { connectDB } from "./DB/database.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import bodyParser from "body-parser";
import NodeCache from "node-cache";
import morgan from "morgan";
config({
    path: "./.env"
})
const app = express();
const port = process.env.PORT || 3000;
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));


connectDB();
export const myCache = new NodeCache();
app.use(express.json({limit: "10mb"}))
app.use(express.urlencoded({extended: true, limit: "10mb"}))
app.use(bodyParser.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(morgan("dev"))


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    
})
import userRouter from "./routes/user.route.js";
import productRouter from "./routes/product.route.js";
import { orderRouter } from "./routes/order.route.js";
import { paymentRouter } from "./routes/payment.route.js";
import { dashboardRouter } from "./routes/stats.route.js";

app.get("/", (req, res) => {
    res.send("API Working with /api/v1");
  });

// Using Routes
app.use("/api/v1/user",userRouter)
app.use("/api/v1/product",productRouter)
app.use("/api/v1/order",orderRouter)
app.use("/api/v1/payment",paymentRouter)
app.use("/api/v1/dashboard",dashboardRouter)

app.use("/uploads",express.static("uploads"))
app.use(errorMiddleware)