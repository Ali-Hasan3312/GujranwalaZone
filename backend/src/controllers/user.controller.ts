import crypto from "crypto";
import { TryCatch } from "../middlewares/error.middleware.js";
import { User } from "../models/user.model.js";
// import { uploadOnCloudinary } from "../utils/cloudinary.js";
import ErrorHandler from "../utils/errorHandler.js";
import { sendEmail } from "../utils/sendEmail.js";
import { config } from "dotenv";
config({
    path: "./.env"
})

export const newUser = TryCatch(async (req, res, next) => {
   const { name, email,password, _id, gender, dob } = req.body;
  
   if (!name || !email  || !_id || !password || !gender || !dob) {
       return next(new ErrorHandler("All fields are required", 400));
   }
   const existedUser = await User.findOne({
       $or: [{ name }, { email }]
   })

   if (existedUser) {
       throw new ErrorHandler("User with email or userName already exists",401)
   }
    const   photo = req.file
  const user = await User.create({
       name,
       email,
       gender,
       dob: new Date(dob),
       photo: photo?.path,
       _id,
       password
   });

   const createdUser = await User.findById(user._id).select(
      "-password "
  )

  if (!createdUser) {
      next(new ErrorHandler("Something went wrong while registering the user",500))
  }
   return res.status(201).json({
       success: true,
       message: "User Created Successfully",
       user
   })
});
export const loginUser = TryCatch(async (req, res) => {
   // Extracting userName, email, and password from the request body
   const { name, email, password } = req.body;
   // Checking if userName or email is provided
   if (!(email || name)) {
       throw new ErrorHandler("userName or email is required",400);
    }
    if (!(password)) {
        throw new ErrorHandler("password is required",400);
    }
    
    // Finding the user in the database based on userName or email
    const user = await User.findOne({email});
    
   

   // If user doesn't exist, throw an error
   if (!user) {
       throw new ErrorHandler("User doesn't exist",400);
   }

   // Checking if the provided password is valid
   const isPasswordValid = await user.isPasswordCorrect(password);
   if (!isPasswordValid) {
       throw new ErrorHandler("Invalid user credentials",401);
   }

   

   // Retrieving logged-in user's details from the database, excluding sensitive information
   const loggedInUser = await User.findById(user._id).select("-password");

   // Options for setting HTTP-only secure cookies
   const options = {
       httpOnly: true,
       secure: true
   };
   
   // Sending cookies and JSON response with logged-in user's details, access token, and refresh token
   const token = user.getJWTToken();
   res.status(201).cookie("token", token).json({
      success: true,
      message: "User LoggedIn Successfully",
      loggedInUser,
      token,
    });
});
export const logoutUser = TryCatch(async(req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      });

    return res
    .status(200)
    .json({
        success: true,
        message: "User Logged Out Successfully"
    })
});
export const changeCurrentPassword = TryCatch(async(req, res) => {
    const {oldPassword, newPassword} = req.body

    

    const user = await User.findById(req.user?._id)
    // const user = await User.findOne({ email });
    
    const isPasswordCorrect = await user?.isPasswordCorrect(oldPassword);
    

    if (!isPasswordCorrect) {
        throw new ErrorHandler("Invalid old password",400)
    }

    

        // Update the user's password in the database
        if(user?.password!==undefined){
         user.password = newPassword;
        }
       
    await user?.save({validateBeforeSave: false});

    return res
    .status(200)
    .json({
        success:true,
        message:"Password Changed Successfully"
    })
});
export const forgotPassword = TryCatch (async (req, res,next) => {
    const user = await User.findOne({email: req.body.email});

    if(!user){
       return next(new ErrorHandler("User not found",404))
    }
    // Get Password Token
    const resetToken = user.getResetPasswordToken();
    await user.save({validateBeforeSave: false});

    const resetPasswordUrl = `${process.env.PROTOCOL}password-reset/${resetToken}`;
    // const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
    const message = `Click here to reset your password :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then, please ignore it `;

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
        throw new ErrorHandler("Internal Server Error",500)
        
    }
});
export const resetPassword = TryCatch(async (req, res, next) => {
    const userToken = req.body.token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(userToken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
 
  if (!user) {
    console.log(`User not found or token expired. Token: ${resetPasswordToken}`);
    return next(new ErrorHandler("Invalid token or has been expired", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  const token = user.getJWTToken();
  res.status(201).cookie("token", token).json({
    success: true,
    user,
    token,
  });
});
// Admin 
export const getAllUsers = TryCatch(async(req,res,next)=>{
   const users = await User.find()
   res.status(200).json({
       success: true,
       users
   })
});
// Admin 
export const getUser = TryCatch(async(req,res,next)=>{
   const id = req.params.id;
   const user = await User.findById(id)
   if(!user){
      return next(new ErrorHandler("Invalid id",401))
   }
   return res
   .status(201)
   .json({
      success: true,
      user
   })
});
// Admin
export const deleteUser = TryCatch(async(req,res,next)=>{
   const id = req.params.id;
   const user = await User.findById(id)
   if(!user){
      return next(new ErrorHandler("Invalid id",401))
   }
   await user.deleteOne()
   return res
   .status(201)
   .json({
      success: true,
      message: "User Deleted Successfully"
   })
});
