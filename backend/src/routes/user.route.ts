import express from "express"
import { changeCurrentPassword, deleteUser, forgotPassword, getAllUsers, getUser, loginUser, logoutUser, newUser, resetPassword } from "../controllers/user.controller.js"
import { authorizeRoles, verifyJWT } from "../middlewares/auth.js"
import { upload } from "../middlewares/multer.middleware.js"
const userRouter = express.Router()

// route = /api/v1/user/new
// To Register new user
userRouter.route("/new").post(upload,newUser)
// To login user
userRouter.route("/login").get(loginUser)
// To logout user
userRouter.route("/logout").post(logoutUser)
//To change current password of user or admin
userRouter.route("/change-password").post(verifyJWT,changeCurrentPassword)
//To send email of token to user for forgotten password
userRouter.route("/forgot-password").post(forgotPassword)
// To reset forgotten password
userRouter.route("/password/reset/:token").put(resetPassword)


// To Get All users by admin
userRouter.route("/getAllUsers").get(verifyJWT,authorizeRoles("admin"),getAllUsers)
//To Delete a user by admin
userRouter.route("/:id").get(getUser).delete(verifyJWT,authorizeRoles("admin"),deleteUser)

export default userRouter