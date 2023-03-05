import catchAsyncError from "../middlewares/catchAsync.js";
import User from "../models/UserModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import { sendEmail } from '../utils/sendEmail.js'


export const userRegiter = catchAsyncError(async (req, resp, next) => {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email })
    if (user) {
        return next(new ErrorHandler("User Already Exists", 400))
    }
    user = await User.create({
        name, email, password
    })
    const token = user.generateToken(password)

    const cookieOptions = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true
    }
    resp.status(200).cookie("token", token, cookieOptions).json({
        success: true,
        message: "User Created Successfully",
        user
    })
})

export const userLogin = catchAsyncError(async (req, resp, next) => {
    const { email, password } = req.body
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("User or password is incorrect"))
    }
    const isMatch = user.isMatched(password)
    if (!isMatch) {
        return next(new ErrorHandler("User or password is incorrect"))
    }

    const token = user.generateToken(password)

    const cookieOptions = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    resp.status(201).cookie("token", token, cookieOptions).json({
        success: true,
        message: "User Logged successfull",
        user
    })

})




export const userLogout = catchAsyncError(async (req, resp, next) => {
    const cookieOptions = {
        expires: new Date(Date.now()),
        httpOnly: true
    }
    resp.status(200).cookie("token", null, cookieOptions).json({
        success: true,
        message: "User Logged Out Successfully"
    })
})

export const getUserDetail = catchAsyncError(async (req, resp, next) => {
    const id = req.params.id
    const user = await User.findById(id)
    if (!user) {
        return next(new ErrorHandler("User not found", 400))
    }

    resp.status(200).json({
        success: true,
        message: "User Details",
        user
    })
})

export const updateUserDetail = catchAsyncError(async (req, resp, next) => {
    const id = req.params.id
    const { name, email, role } = req.body

    const user = await User.findById(id)
    if (!user) {
        return next(new ErrorHandler("User not found", 400))
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    await user.save()

    resp.status(200).json({
        success: true,
        message: "User Updated",
        user
    })
})


export const forgetPassword = catchAsyncError(async (req, resp, next) => {
    const email = req.body;

    const user = await User.findOne(email)

    if (!user) {
        return next(new ErrorHandler("User not found"))
    }

    const resetToken = user.getUserPasswordToken()
    await user.save({ validateBeforeSave: false });
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`

    console.log(resetPasswordUrl)

    const message = `Your reset password token is: \n\n ${resetPasswordUrl} \n\n Please ignore if you not requested`

    try {
        await sendEmail({
            email: user.email,
            subject: "Password recovery email",
            message
        })
        resp.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500))
    }


})

export const updatePassword = catchAsyncError(async (req, resp, next) => {
    const { oldpassword, newpassword, confirmnewpassword } = req.body;

    const user = await User.findById(req.user.id).select("+password")
    if (!user) {
        return next(new ErrorHandler("User not found",400))
    }
    
    const isMatch = await user.isMatched(oldpassword)
    if (!isMatch) {
        return next(new ErrorHandler("Old password is incorrect",400))
    }
    if (newpassword !== confirmnewpassword) {
        return next(new ErrorHandler("Password does not matched'",400))
    }

    user.password = newpassword;
    await user.save()

    resp.status(201).json({
        success: true,
        message: "Password Update",
        user
    })

})


//Get All Users
export const allUsers = catchAsyncError(async(req,resp,next)=>{
    const users = await User.find();
    const user_count = users.length
    resp.status(200).json({
        success:true,
        user_count,
        users
    })
})

// Get User detail by admin
export const getUserByAdmin = catchAsyncError(async (req, resp, next) => {
    const id = req.params.id
    const user = await User.findById(id)
    if (!user) {
        return next(new ErrorHandler("User not found", 400))
    }

    resp.status(200).json({
        success: true,
        message: "User Details",
        user
    })
})

// Update User detail by admin
export const updateUserByAdmin = catchAsyncError(async (req, resp, next) => {
    const id = req.params.id
    const { name, email, role } = req.body

    const user = await User.findById(id)
    if (!user) {
        return next(new ErrorHandler("User not found", 400))
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    await user.save()

    resp.status(200).json({
        success: true,
        message: "User Updated",
        user
    })
})

// Delete User detail by admin
export const deleteUserByAdmin = catchAsyncError(async (req, resp, next) => {
    const id = req.params.id
    const user = await User.findById(id)
    if (!user) {
        return next(new ErrorHandler("User not found", 400))
    }
    await user.deleteOne()
    resp.status(200).json({
        success: true,
        message: "User Deleted",
    })
})