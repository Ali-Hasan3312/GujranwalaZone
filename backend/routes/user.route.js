import { Router } from "express";
import { upload } from "../midlewares/multer.middleware.js";
import { loginUser,
        registerUser,
        logoutUser,
        changeCurrentPassword,
        updateAccountDetails,
        updateUserAvatar,
        forgotPassword,
        resetPassword,
        getUserDetails,
        getAllUsers,
        getSingleUser,
        updateUserRole,
        deleteUser,
        
        
} from "../controllers/user.controller.js";
import { verifyJWT, authorizeRoles } from "../midlewares/auth.middleware.js";

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
userRouter.route("/get-userDetails").get(verifyJWT,getUserDetails)
userRouter.route("/admin/getAllUsers").get(verifyJWT,authorizeRoles("admin"),getAllUsers)
userRouter.route("/admin/getSingleUser/:id").get(verifyJWT,authorizeRoles("admin"),getSingleUser)
userRouter.route("/admin/update-userRole/:id").patch(verifyJWT,authorizeRoles("admin"),updateUserRole)
userRouter.route("/admin/delete-user/:id").delete(verifyJWT,authorizeRoles("admin"),deleteUser)

export {userRouter}