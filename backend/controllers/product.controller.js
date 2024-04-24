import { Product } from "../models/product.model.js"
import { ApiError } from "../utils/apiError.js";
import apiFeatures from "../utils/apiFeatures.js";
import {asyncHandler} from "../utils/asyncHandler.js";
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

        const productCount = await Product.countDocuments();
        const apifeatures = await  new apiFeatures(Product.find(), req.query)
        .search()
        .filter()
        .pagination(5)
        const products = await apifeatures.query;
        if(!products){
            throw new ApiError(404, "Products not Found")
        }
    
        res
        .status(200)
        .json({
            success: true,
            products,
            productCount
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
const createProductReview = asyncHandler(async (req, res) =>{
    const {productId, comment, rating} = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }
    const product = await Product.findById(productId);
    const isReviewed = product.reviews.find(
        (rev) => rev.user.toString()===req.user._id.toString()
    );
    if(isReviewed){
        product.reviews.forEach(
            (rev) =>{
                if(rev.user.toString()===req.user._id.toString()){
                    rev.rating = rating,
                    rev.comment = comment
                }
            }
        )
    }else{
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length
    }
    let avg = 0;
    product.reviews.forEach((rev)=>{ 
        avg+=rev.rating
    })
    console.log(avg);
    product.ratings = avg / product.reviews.length;
     await product.save({validateBeforeSave: false});
     res.status(200).json({
        success: true
     })

}) ;
export {getAllProducts, createProduct, updateProduct, deleteProduct, productDetails, createProductReview}