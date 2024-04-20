import express from "express"
import { Router } from "express"
import { createProduct, deleteProduct, getAllProducts, productDetails, updateProduct } from "../controllers/product.controller.js";

const userRouter = Router();

userRouter.route("/products").get(getAllProducts);
userRouter.route("/products/new").post(createProduct);
userRouter.route("/products/:id").put(updateProduct).delete(deleteProduct).get(productDetails);

export {userRouter}