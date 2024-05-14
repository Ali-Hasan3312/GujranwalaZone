import { TryCatch } from "../middlewares/error.middleware.js";
import { User } from "../models/user.model.js";
// import { uploadOnCloudinary } from "../utils/cloudinary.js";
import ErrorHandler from "../utils/errorHandler.js";


export const newUser = TryCatch(async (req, res, next) => {
   const { name, email,password, _id, gender } = req.body;
  
   if (!name || !email  || !_id || !password) {
       return next(new ErrorHandler("All fields are required", 400));
   }
   const existedUser = await User.findOne({
       $or: [{ name }, { email }]
   })

   if (existedUser) {
       throw new ErrorHandler("User with email or userName already exists",401)
   }
  
   
    const   photo = req.file
    console.log(photo);
    
    
  const user = await User.create({
       name,
       email,
       gender,
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
   const user = await User.findOne({
       $or: [{ name }, { email }]
   });
   

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
})
// Admin 
export const getAllUsers = TryCatch(async(req,res,next)=>{
   const users = await User.find()
   res.status(200).json({
       success: true,
       users
   })
})
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
