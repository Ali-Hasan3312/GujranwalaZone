import express from "express"
import bodyParser from "body-parser"
const app = express()

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// import routes

import { userRouter } from "./routes/product.route.js"
app.use("/api/v1", userRouter)

export {app}