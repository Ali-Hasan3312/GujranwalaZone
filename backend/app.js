import express from "express"

const app = express()

app.use(express.json())
// import routes

import { userRouter } from "./routes/product.route.js"
app.use("/api/v1", userRouter)

export {app}