import Order from "../models/OrderModel.js";
import catchAsyncError from '../middlewares/catchAsync.js'
import Product from '../models/productModel.js'
import ErrorHandler from "../utils/errorHandler.js";

//Create Order
export const newOrder = catchAsyncError(async (req, resp, next) => {
    const { orderItems, shippingInfo, paymentInfo, itemPrice, taxPrice, shippingPrice, totalPrice } = req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user.id
    })

    resp.status(200).json({
        success: true,
        message: "Order created successfully",
        order
    })
})

//Get Single Order
export const getSingleOrder = catchAsyncError(async (req, resp, next) => {
    const { id } = req.params;
    const order = await Order.findById(id).populate("user", "name email")
    if (!order) {
        return next(new ErrorHandler("Order not found", 500))
    }

    resp.status(200).json({
        success: true,
        order
    })
})

//Get My Orders
export const getMyOrder = catchAsyncError(async (req, resp, next) => {

    const orders = await Order.find({ user: req.user.id })

    resp.status(200).json({
        success: true,
        orders
    })
})
//Get All Orders Admin
export const getAllOrder = catchAsyncError(async (req, resp, next) => {

    const orders = await Order.find()
    let totalAmount = 0;
    orders.forEach((order) => {
        totalAmount += order.totalPrice
    })

    resp.status(200).json({
        success: true,
        totalAmount,
        orders
    })
})

//Update Order status
export const updateOrder = catchAsyncError(async (req, resp, next) => {
    const { id } = req.params;
    const order = await Order.findById(id)
    if (!order) {
        return next(new ErrorHandler("Order not found", 400))
    }

    if (order.orderStatus === 'delivered') {
        return next(new ErrorHandler("You have already delivered this order", 400))
    }
    
    order.orderItems.forEach(async(order)=>{
        await updateStock(order.product, order.quantity)
    })

    order.orderStatus = req.body.status


    if( req.body.status==='delivered')
    {
        order.deliverdAt = Date.now()
    }

    await order.save({validateBeforeSave:false})
    resp.status(201).json({
        success: true
    })
})
async function updateStock(id, quantity)
{
    const product = await Product.findById(id);
    product.stock -= quantity;
    await product.save({validateBeforeSave:false})
}

export const deleteOrder = catchAsyncError(async (req, resp, next) => {

    const { id } = req.params;
    const order = await Order.findById(id)
    if (!order) {
        return next(new ErrorHandler("Order not found", 400))
    }
    await order.deleteOne()

    resp.status(200).json({
        success: true,
        message:"Order deleted successfully"
    })
})

