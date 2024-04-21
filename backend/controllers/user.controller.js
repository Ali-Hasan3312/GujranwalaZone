import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary, deleteImageFromCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiResponse.js"
import Jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

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
        "-password -refreshToken"
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
    console.log(user);

    // If user doesn't exist, throw an error
    if (!user) {
        throw new ApiError(400, "User doesn't exist");
    }

    // Checking if the provided password is valid
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    // Generating access token and refresh token
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

    // Retrieving logged-in user's details from the database, excluding sensitive information
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    // Options for setting HTTP-only secure cookies
    const options = {
        httpOnly: true,
        secure: true
    };

    // Sending cookies and JSON response with logged-in user's details, access token, and refresh token
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                "User logged in successfully"
            )
        );
});

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = Jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})

const changeCurrentPassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword} = req.body

    

    const user = await User.findById(req.user?._id)
    // const user = await User.findOne({ email });
    console.log(oldPassword);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword, user.password);
    console.log(user.password);

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
    
    const avatar = await deleteImageFromCloudinary(avatarLocalPath)
    
    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading on cloudinary")
        
    }
    
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar: avatar.url
            }
        },
        {new: true}
        ).select("-password")
        
        const myuser = await User.findById(req.user?._id);
        const Url = myuser.avatar.url;
         deleteFileByUrl(Url)
        return res
        .status(200)
        .json(
        new ApiResponse(200, user, "Avatar image updated successfully")
    )
})



export {
    generateAccessAndRefereshTokens,
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    updateAccountDetails,
    updateUserAvatar,
    
};