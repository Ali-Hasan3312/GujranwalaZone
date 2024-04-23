import { Router } from "express";
import { upload } from "../midlewares/multer.middleware.js";
import { loginUser,
        registerUser,
        logoutUser,
        changeCurrentPassword,
        updateAccountDetails,
        updateUserAvatar,
        forgotPassword,
        resetPassword
        
} from "../controllers/user.controller.js";
import { verifyJWT } from "../midlewares/auth.middleware.js";

const userRouter = Router();
userRouter.route("/register").post(
    upload.fields([
        {
            name: "Avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ])
    ,registerUser)

userRouter.route("/login").post( upload.fields([
        {
            name: "Avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]) ,loginUser)

//secured routes
userRouter.route("/logout").post(verifyJWT,logoutUser)
userRouter.route("/change-password").post(verifyJWT,changeCurrentPassword)
userRouter.route("/update-account").patch(verifyJWT,updateAccountDetails)
userRouter.route("/avatar").patch(upload.single("Avatar"), updateUserAvatar)
userRouter.route("/password/forgot").post(forgotPassword)
userRouter.route("/password/reset/:token").put(resetPassword)

export {userRouter}