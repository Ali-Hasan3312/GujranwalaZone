import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { IUser, User } from "../models/user.model.js";
import ErrorHandler from "../utils/errorHandler.js";
import { TryCatch } from "./error.middleware.js";
declare module 'express-serve-static-core' {
    interface Request {
      user?: IUser & { _id: string };
    }
  }

  export const verifyJWT = TryCatch(async (req, res, next) => {
    const  _id  = req.query.id as string; // Extract the _id from query parameters
  console.log(req.query);
  
   
    const { ObjectId } = mongoose.Types;

    if (!_id || !ObjectId.isValid(_id)) {
      return res.status(400).json({
        success: false,
        message: "Please login to access this resource",
      });
    }
  
    const user = await User.findById(_id).select("-password");
  
    if (!user) {
      return next(new ErrorHandler("Invalid Token", 401));
    }
  
    req.user = user;
  
    next();
  });

export const authorizeRoles = (...roles:string[]) => {
    return (req:Request, res:Response, next:NextFunction) => {
      if (!req.user || !roles.includes(req.user.role)) {
        return next(
          new ErrorHandler(
            `${req.user?.role} is not allowed to access this resouce `,403
            
          )
        );
      }
  
      next();
    };
  }; 