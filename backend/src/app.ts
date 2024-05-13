import express from "express";

const port = 4000 ;
const app = express();


connectDB();
app.use(express.json())
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    
})
import userRouter from "./routes/user.route.js";
import { connectDB } from "./DB/database.js";


app.use("/api/v1/user",userRouter)