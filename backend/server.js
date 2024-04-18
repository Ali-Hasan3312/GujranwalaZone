import express from "express"
import { app } from "./app.js";
import connectDB from "./db/index.js";
import dotenv from "dotenv"
const port = 3000 || process.env.PORT

dotenv.config({
    path: "./.env"
})

connectDB()
.then(() => {
    app.listen(process.env.PORT || 3000, () => {
        
        console.log(`server is running on port ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGODB connection failed  !!!", err);
})