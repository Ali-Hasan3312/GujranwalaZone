import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.model.js";
import ErrorHandler from "../utils/errorHandler.js";
import { TryCatch } from "./error.middleware.js";
import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken"
import { IUser } from "../models/user.model.js";
declare module 'express-serve-static-core' {
    interface Request {
      user?: IUser & { _id: string };
    }
  }

export const verifyJWT = TryCatch(async(req, res, next) => {
    
    const token:string | undefined  = req.cookies.token;
        
        
        if (!token) {
            return res
            .status(400)
            .json({
              success: false,
              message: "Please login to access this resource"
            })
        }
    
        const decodedData = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload ;

    
      const user = await User.findById(decodedData?.id).select("-password ")
    
        if (!user) {
            
            return next(new ErrorHandler( "Invalid Token",401)) 
        }
        req.user = user

  next();
   
    
});

export const authorizeRoles = (...roles:string[]) => {
    return (req:Request, res:Response, next:NextFunction) => {
      if (!req.user || !roles.includes(req.user.role)) {
        return next(
          new ErrorHandler(
            `Role: ${req.user?.role} is not allowed to access this resouce `,403
            
          )
        );
      }
  
      next();
    };
  }; 