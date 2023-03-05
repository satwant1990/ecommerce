import mongoose from "mongoose";
import catchAsyncError from "../middlewares/catchAsync.js";
const connectDatabase = catchAsyncError(()=>{
    mongoose.connect(process.env.MONGOURL,{
        useNewUrlParser:true,
    })
    .then(({connection})=>console.log(`MongoDB is connected at: ${connection.host}`))
    .catch((error)=>console.log(error.message))
})

export default connectDatabase;