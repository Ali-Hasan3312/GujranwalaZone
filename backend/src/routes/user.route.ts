import express from "express"
import { changeCurrentPassword, deleteUser, forgotPassword, getAllUsers, getUser, loginUser, logoutUser, newUser, resetPassword } from "../controllers/user.controller.js"
import { authorizeRoles, verifyJWT } from "../middlewares/auth.js"
import { upload } from "../middlewares/multer.middleware.js"
const userRouter = express.Router()

// route = /api/v1/user/new
userRouter.route("/new").post(upload,newUser)
userRouter.route("/login").get(loginUser)
userRouter.route("/logout").post(logoutUser)
userRouter.route("/change-password").post(verifyJWT,changeCurrentPassword)
userRouter.route("/forgot-password").post(forgotPassword)
userRouter.route("/password/reset/:token").put(resetPassword)

userRouter.route("/getAllUsers").get(verifyJWT,authorizeRoles("admin"),getAllUsers)
userRouter.route("/:id").get(getUser).delete(verifyJWT,authorizeRoles("admin"),deleteUser)

export default userRouter