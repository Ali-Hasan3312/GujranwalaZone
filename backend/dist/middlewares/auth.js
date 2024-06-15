import { User } from "../models/user.model.js";
import ErrorHandler from "../utils/errorHandler.js";
import { TryCatch } from "./error.middleware.js";
// Middleware to make sure only admin is allowed
export const adminOnly = TryCatch(async (req, res, next) => {
    const { id } = req.query;
    if (!id)
        return next(new ErrorHandler("Please login to access this resource", 401));
    const user = await User.findById(id);
    if (!user)
        return next(new ErrorHandler("Invalid Id", 401));
    if (user.role !== "admin")
        return next(new ErrorHandler(`${user?.role} is not allowed to access this resouce `, 403));
    next();
});
