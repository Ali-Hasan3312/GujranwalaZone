import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";
    
export const verifyJWT = asyncHandler(async(req, res, next) => {
    
    const token  = req.cookies.token;
        
        
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
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
          new ErrorHander(
            `Role: ${req.user.role} is not allowed to access this resouce `,
            403
          )
        );
      }
  
      next();
    };
  }; 