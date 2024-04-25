import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import apiFeatures from "../utils/apiFeatures.js";
// create new order
const newOrder = asyncHandler(async(req,res, next)=>{
    const {shippingInfo,
          orderItems,
          paymentInfo,
          itemsPrice,
          taxPrice,
          shippingPrice,
          totalPrice } = req.body;
          const order = await Order.create({
            shippingInfo,
          orderItems,
          paymentInfo,
          itemsPrice,
          taxPrice,
          shippingPrice,
          totalPrice,
          paidAt: Date.now(),
          user: req.user._id,
          });
    
    res.status(200).json({
        success: true,
        order
    })

});
// get single order 
const getSingleOrder = asyncHandler(async(req,res,next)=>{
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if(!order){
   return res.status(404).json({success: false, message: "Order not found"})
    }
    res.status(200).json({
        success: true,
        order
    })

});
// get loggedIn user orders
const myOrders = asyncHandler(async(req,res,next)=>{
    const orders = await Order.find({user: req.user._id});
    if(!orders){
        return new ApiResponse(404, "Orders not found");
    }
    res.status(200).json({
        success: true,
        orders
    })

});
// get all orders --Admin
const getAllOrders = asyncHandler(async(req, res, next)=>{
    const orders = await Order.find();
    if(!orders){
        throw new ApiError(404, "Orders not found")
    }
    let totalAmount = 0;
    orders.forEach((order)=>{
        totalAmount+=order.totalPrice
    })
    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
    orders.save({validateBeforeSave: false})

});
// update order status --Admin
const updateOrder = asyncHandler(async(req,res,next)=>{
    const order = await Order.findById(req.params.id);
   
    if(order.orderStatus==="Delivered"){
        throw new ApiError(400, "You have already delivered this order")
    }
    
    order.orderItems.forEach(async(order)=>{
        await updateStock(order.product, order.quantity)
    });
    order.orderStatus = req.body.status;
    if(req.body.status ==="Delivered"){
        order.deliveredAt = Date.now()
    }
    await order.save({validateBeforeSave: false})
    res.status(200).json({
        success: true
    })
});
async function updateStock (id, quantity){
    const product = await Product.findById(id);
    product.stock -= quantity;
    product.save({validateBeforeSave: false})
 }
// Delete an order
const deleteOrder = asyncHandler(async(req,res)=>{
    const order = await Order.findById(req.params.id);
    if(!order){
        throw new ApiError(404, "Order not found");
    }
   await order.deleteOne();
   order.save({validateBeforeSave: true})
    res.status(200).json({
        success: true,
        message: "Order deleted successfully"
    });
})
export {newOrder,getSingleOrder,myOrders, getAllOrders,updateOrder,deleteOrder}