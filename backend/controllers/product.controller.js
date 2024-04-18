import { Product } from "../models/product.model.js"

// Create Product  --Adimn
const createProduct = async (req, res, next)=>{
    const product = await Product.create(req.body);
    if(!product){
        console.log("Something went wrong while creating a product");
    }
    res
    .status(201)
    .json({
        success: true,
        product
    })
}
// Get All Products
const getAllProducts = async (req, res)=>{
    const products = await Product.find();
    if(!products){
        console.log("Something went wring while findind products");
    }

    res
    .status(200)
    .json({
        success: true,
        products
    })
}

// Update a product --Admin 
const updateProduct = async(req, res, next) => {
    let product = await Product.findById(req.params.id);

    if(!product){
        return res
        .status(500)
        .json({
            success: false,
            message: "product not found"
        })

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

}
export {getAllProducts, createProduct, updateProduct}