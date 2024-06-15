import { TryCatch } from "../middlewares/error.middleware.js";
import ErrorHandler from "../utils/errorHandler.js";
import { Product } from "../models/product.model.js";
import { rm } from "fs";
import { myCache } from "../app.js";
import { invalidateCache } from "../utils/features.js";
import { config } from "dotenv";
config({
    path: "../../.env"
});
export const getlatestProducts = TryCatch(async (req, res, next) => {
    let products;
    if (myCache.has("latest-products"))
        products = JSON.parse(myCache.get("latest-products"));
    else {
        products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
        myCache.set("latest-products", JSON.stringify(products));
    }
    return res.status(201).json({
        success: true,
        products,
    });
});
export const getAllCategories = TryCatch(async (req, res, next) => {
    let categories;
    if (myCache.has("categories"))
        categories = JSON.parse(myCache.get("categories"));
    else {
        categories = await Product.distinct("category");
        myCache.set("categories", JSON.stringify(categories));
    }
    return res.status(201).json({
        success: true,
        categories,
    });
});
export const getAdminProducts = TryCatch(async (req, res, next) => {
    let products;
    if (myCache.has("all-products")) {
        products = JSON.parse(myCache.get("all-products"));
    }
    else {
        products = await Product.find();
        myCache.set("all-products", JSON.stringify(products));
    }
    return res.status(201).json({
        success: true,
        products,
    });
});
export const getSingleProduct = TryCatch(async (req, res, next) => {
    let product;
    const id = req.params.id;
    if (myCache.has(`product-${id}`)) {
        product = JSON.parse(myCache.get(`product-${id}`));
    }
    else {
        product = await Product.findById(id);
        if (!product)
            return next(new ErrorHandler("Invalid Product Id", 404));
        myCache.set(`product-${id}`, JSON.stringify(product));
    }
    return res.status(201).json({
        success: true,
        product,
    });
});
export const newProduct = TryCatch(async (req, res, next) => {
    const { name, price, stock, category } = req.body;
    const photo = req.file;
    if (!photo) {
        return next(new ErrorHandler("Please Add Photo", 401));
    }
    if (!name || !price || !stock || !category) {
        rm(photo.path, () => {
        });
        return next(new ErrorHandler("All fields are required", 401));
    }
    const product = await Product.create({
        name,
        price,
        category: category.toLocaleLowerCase(),
        stock,
        photo: photo.path
    });
    console.log(product);
    invalidateCache({ product: true, admin: true });
    return res.status(201).json({
        success: true,
        message: "Product Created Successfully",
        product
    });
});
export const updateProduct = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const photo = req.file;
    const product = await Product.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
    if (!product) {
        return next(new ErrorHandler("Invalid Product Id", 404));
    }
    if (photo) {
        rm(product.photo, () => {
            console.log("Old Photo Deleted");
        });
        product.photo = photo.path;
    }
    product.save({
        validateBeforeSave: false
    });
    invalidateCache({
        product: true,
        productId: String(product._id),
        admin: true,
    });
    return res.status(201).json({
        success: true,
        message: "Product Updated Successfully",
        product
    });
});
export const deleteProduct = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (!product) {
        return next(new ErrorHandler("Invalid Product Id", 404));
    }
    rm(product.photo, () => {
    });
    await product.deleteOne();
    invalidateCache({
        product: true,
        productId: String(product._id),
        admin: true,
    });
    return res.status(201).json({
        success: true,
        message: "Product Deleted Successfully",
    });
});
export const getAllProducts = TryCatch(async (req, res, next) => {
    const { search, sort, category, price } = req.query;
    const page = Number(req.query.page) || 1;
    // 1,2,3,4,5,6,7,8
    // 9,10,11,12,13,14,15,16
    // 17,18,19,20,21,22,23,24
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = (page - 1) * limit;
    const baseQuery = {};
    if (search)
        baseQuery.name = {
            $regex: search,
            $options: "i",
        };
    if (price)
        baseQuery.price = {
            $lte: Number(price),
        };
    if (category)
        baseQuery.category = category;
    const productsPromise = Product.find(baseQuery)
        .sort(sort && { price: sort === "asc" ? 1 : -1 })
        .limit(limit)
        .skip(skip);
    const [products, filteredOnlyProduct] = await Promise.all([
        productsPromise,
        Product.find(baseQuery),
    ]);
    const totalPage = Math.ceil(filteredOnlyProduct.length / limit);
    return res.status(200).json({
        success: true,
        products,
        totalPage,
    });
});