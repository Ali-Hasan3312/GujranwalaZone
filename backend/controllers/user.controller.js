import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary, deleteImageFromCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { extractPublicId } from "cloudinary-build-url"
import { sendEmail } from "../utils/sendEmail.js"
import { sendToken } from "../utils/jwtToken.js"
import crypto from "crypto"
import { Product } from "../models/product.model.js"

const registerUser = asyncHandler( async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: userName, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res


    const {name, email, userName, password } = req.body
    

    if (
        [name, email, userName, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ userName }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or userName already exists")
    }
  

    let avatarLocalPath;
    if (req.files && Array.isArray(req.files.Avatar) && req.files.Avatar.length > 0) {
        avatarLocalPath = req.files.Avatar[0].path
    }
   
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
   
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    

    // if (!avatar) {
    //     throw new ApiError(400, "Avatar is required")
    // }
   

    const user = await User.create([
        {
        name,
        Avatar: avatar?.url,
        coverImage: coverImage?.url || "",
        email, 
        password,
        userName: userName?.toLowerCase()
    },
])

    const createdUser = await User.findById(user._id).select(
        "-password "
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

} )
const loginUser = asyncHandler(async (req, res) => {
    // Extracting userName, email, and password from the request body
    const { userName, email, password } = req.body;
     
    // Checking if userName or email is provided
    if (!(email || userName)) {
        throw new ApiError(400, "userName or email is required");
    }
    if (!(password)) {
        throw new ApiError(400, "password is required");
    }

    // Finding the user in the database based on userName or email
    const user = await User.findOne({
        $or: [{ userName }, { email }]
    });
    

    // If user doesn't exist, throw an error
    if (!user) {
        throw new ApiError(400, "User doesn't exist");
    }

    // Checking if the provided password is valid
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    

    // Retrieving logged-in user's details from the database, excluding sensitive information
    const loggedInUser = await User.findById(user._id).select("-password");

    // Options for setting HTTP-only secure cookies
    const options = {
        httpOnly: true,
        secure: true
    };
    
    // Sending cookies and JSON response with logged-in user's details, access token, and refresh token
    sendToken(user, 200, res)
});

const logoutUser = asyncHandler(async(req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      });

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "User logged Out"))
})
const changeCurrentPassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword} = req.body

    

    const user = await User.findById(req.user?._id)
    // const user = await User.findOne({ email });
    
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    

        // Update the user's password in the database
        user.password = newPassword;
       
    await user.save({validateBeforeSave: false});

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})
const updateAccountDetails = asyncHandler(async(req, res) => {
    const {name, email} = req.body

    if (!name || !email) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                userName: name,
                email: email
            }
        },
        {new: true}
        
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))
});
const updateUserAvatar = asyncHandler(async(req, res) => {
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    //TODO: delete old image - assignment
    
    const myuser = await User.findById(req.user?._id);
    const Url = myuser.Avatar;
    const publicId = extractPublicId(Url) 
    await deleteImageFromCloudinary(publicId) ;
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading on cloudinary")
        
    }
    
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                Avatar: avatar.url
            }
        },
        {new: true}
        ).select("-password")
        
        
        return res
        .status(200)
        .json(
        new ApiResponse(200, user, "Avatar image updated successfully")
    )
})
const forgotPassword = asyncHandler (async (req, res) => {
    const user = await User.findOne({email: req.body.email});

    if(!user){
        throw new ApiError(404, "User not found")
    }
    // Get Password Token
    const resetToken = user.getResetPasswordToken();
    await user.save({validateBeforeSave: false});

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then, please ignore it `;

    try {
        await sendEmail({
            email: user.email,
            subject: `Gujranwala Zone Password Recovery`,
            message
        });
        res
        .status(200)
        .json({
            success: true,
            message: `Email sent to ${user.email} sucessfully`
        })
        
    } catch (error) {
        user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
        throw new ApiError(500, error.message)
        
    }
});
// Reset password
const resetPassword = asyncHandler( async (req, res, next) => {
    const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
   
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
      });
      
    if(!user){
        throw new ApiError(400, "Invalid token or has been expired")

    }
    if(req.body.password !== req.body.confirmPassword){
        throw new ApiError(400, "Password doesn't match")
    }
    user.password = req.body.password;
    user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);

});
// Get User Details
const getUserDetails = asyncHandler(async (req, res, next)=>{
    const user = await User.findById(req.user?._id);
    if(!user){
        throw new ApiResponse(400, "Please login to access this resource")
    }
    res
    .status(200)
    .json({
        success: true,
        user
    });
});
// Get All Users (admin)
const getAllUsers = async(req, res,)=>{
    const users = await User.find()
    res.status(200).json({
        success: true,
        users
    })
};
// get single user (admin)
const getSingleUser = asyncHandler(async(req, res, next)=>{
    const user = await User.findById(req.params.id);
    if(!user){
        throw new ApiError(404, `User with id:${req.params.id} doesn't exist` );
    }
    res.status(200).json({
        success: true,
        user
    })
});
// Update User Role  --Admin
const updateUserRole = asyncHandler(async(req, res) => {
    const {name, email, role} = req.body

    if (!name || !email) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                userName: name,
                email: email,
                role: role
            }
        },
        {new: true}
        
    ).select("-password")
    if(!user){
        throw new ApiError(404, `user with id:${req.params.id} doesn't exist`)
       }

    return res
    .status(200)
    .json(new ApiResponse(200, user, "User role updated successfully"))
});
// Delete a user --Admin
const deleteUser = asyncHandler(async(req, res) => {
   const user = await User.findById(req.params.id);
   if(!user){
    throw new ApiError(404, `user with id:${req.params.id} doesn't exist`)
   }
   await user.deleteOne();
   res.status(200).json({
    success: true,
    message: "User removed successfully"
   })

   

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))
});

export {
    
    registerUser,
    loginUser,
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
    deleteUser
};