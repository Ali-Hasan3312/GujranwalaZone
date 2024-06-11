// import { NextFunction, Request, Response } from "express";
// import mongoose from "mongoose";
// import { IUser, User } from "../models/user.model.js";
// import ErrorHandler from "../utils/errorHandler.js";
// import { TryCatch } from "./error.middleware.js";
// declare module 'express-serve-static-core' {
//     interface Request {
//       user?: IUser & { _id: string };
//     }
//   }

//   export const verifyJWT = TryCatch(async (req, res, next) => {
//     const  _id  = req.query.id as string; // Extract the _id from query parameters
//     const token = req.cookies.token ;
//     console.log(token);
    
  
   
//     const { ObjectId } = mongoose.Types;

//     if (!_id || !ObjectId.isValid(_id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Please login to access this resource",
//       });
//     }
  
//     const user = await User.findById(_id).select("-password");
  
//     if (!user) {
//       return next(new ErrorHandler("Invalid Token", 401));
//     }
  
//     req.user = user;
  
//     next();
//   });

// export const authorizeRoles = (...roles:string[]) => {
//     return (req:Request, res:Response, next:NextFunction) => {
//       if (!req.user || !roles.includes(req.user.role)) {
//         return next(
//           new ErrorHandler(
//             `${req.user?.role} is not allowed to access this resouce `,403
            
//           )
//         );
//       }
  
//       next();
//     };
//   }; 

import { User } from "../models/user.model.js";
import ErrorHandler from "../utils/errorHandler.js";
import { TryCatch } from "./error.middleware.js";

// Middleware to make sure only admin is allowed
export const adminOnly = TryCatch(async (req, res, next) => {
  const { id } = req.query;

  if (!id) return next(new ErrorHandler("Please login to access this resource", 401));

  const user = await User.findById(id);
  if (!user) return next(new ErrorHandler("Invalid Id", 401));
  if (user.role !== "admin")
    return next(new ErrorHandler( `${user?.role} is not allowed to access this resouce `, 403));

  next();
});