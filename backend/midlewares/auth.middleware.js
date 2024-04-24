import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
    
export const verifyJWT = asyncHandler(async(req, res, next) => {
    
    const token  = req.cookies.token;
        
        
        if (!token) {
            return res
            .status(400)
            .json({
              success: false,
              message: "Please login to access this resource"
            })
        }
    
        const decodedData = Jwt.verify(token, process.env.JWT_SECRET);

    
      const user = await User.findById(decodedData?.id).select("-password ")
    
        if (!user) {
            
            throw new ApiError(401, "Invalid Token")
        }
        req.user = user

  next();
   
    
});

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(
          new ApiError(
            403,`Role: ${req.user.role} is not allowed to access this resouce `,
            
          )
        );
      }
  
      next();
    };
  }; 