import express from "express"
import { deleteUser, getAllUsers, getUser, loginUser, logoutUser, newUser } from "../controllers/user.controller.js"
import { authorizeRoles, verifyJWT } from "../middlewares/auth.js"
import { upload } from "../middlewares/multer.middleware.js"
const userRouter = express.Router()

// route = /api/v1/user/new
userRouter.route("/new").post(upload,newUser)
userRouter.route("/login").get(loginUser)
userRouter.route("/logout").post(logoutUser)


userRouter.route("/getAllUsers").get(verifyJWT,authorizeRoles("admin"),getAllUsers)
userRouter.route("/:id").get(getUser).delete(verifyJWT,authorizeRoles("admin"),deleteUser)

export default userRouter