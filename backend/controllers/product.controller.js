import { Product } from "../models/product.model.js"
import { ApiError } from "../utils/apiError.js";
import apiFeatures from "../utils/apiFeatures.js";
import asyncHandler from "../utils/asyncHandler.js";
// Create Product  --Adimn
const createProduct =asyncHandler( async (req, res, next)=>{
   
     const product = await Product.create(req.body);
     if(!product){
         throw new ApiError(400, "Product not created");
     }
     res
     .status(201)
     .json({
         success: true,
         product
     })
  
})
// Get All Products
const getAllProducts =asyncHandler( async (req, res)=>{
    
        const apifeatures = await  new apiFeatures(Product.find(), req.query).search().filter()
        const products = await apifeatures.query;
        if(!products){
            throw new ApiError(404, "products not found")
        }
    
        res
        .status(200)
        .json({
            success: true,
            products
        })
   
})

// Update a product --Admin 
const updateProduct =asyncHandler( async(req, res, next) => {
    try {
        let product = await Product.findById(req.params.id);
    
        if(!product){
            throw new ApiError(500, "Product not found")
        }
    
        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false
    
        });
    
        res
        .status(200)
        .json({
            success: true,
            product
        })
    } catch (error) {
        throw new ApiError(501, "Something went wrong while updating product")
        
    }

})

// delete a product
const deleteProduct = asyncHandler( async (req, res, next)=>{
    try {
        const product = await Product.findById(req.params.id);
        if(!product){
          throw new ApiError(500, "Product not found")
    }
        await product.deleteOne();
        res
        .status(200)
        .json({
            success: true,
            message: "Product Deleted Successfully"
        })
    } catch (error) {
        throw new ApiError(501, "Something went wrong while deleting product")
        
    }
})
// Get a single product
const productDetails = asyncHandler(async (req, res, next)=>{
   
     try {
        const product = await Product.findById(req.params.id);
       if(!product){
        throw new ApiError(401, "Please provide a valid product id")
       }
       return res
        .status(200)
        .json({
            success: true,
            product
        })
     } catch (error) {
      throw new ApiError(400, "Something went wrong while getting product id")
     }
    
})
export {getAllProducts, createProduct, updateProduct, deleteProduct, productDetails}