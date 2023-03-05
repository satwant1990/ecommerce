import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncError from "./catchAsync.js";
import Jwt from "jsonwebtoken";
import User from "../models/UserModel.js";



export const isAuthenticated = catchAsyncError(async(req,resp,next)=>{
    const {token} = req.cookies
    if(!token)
    {
        return next(new ErrorHandler("Please login first to access this routes", 400))
    }
    const decoded = await Jwt.verify(token, process.env.JWT_TOKEN)
    req.user = await User.findById(decoded.id)
    next()
})

export const isAuthorized = catchAsyncError(async(req,resp,next)=>{
    const {role} = req.user;
    if(role!=='admin')
    {
        return next(new ErrorHandler("You do not have access to this route", 400))
    }
    next()
})