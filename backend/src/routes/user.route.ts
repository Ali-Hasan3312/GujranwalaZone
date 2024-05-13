import express from "express"
import { newUser } from "../controllers/user.controller.js"

const userRouter = express.Router()

// route = /api/v1/user/new
userRouter.post("/new", newUser)

export default userRouter