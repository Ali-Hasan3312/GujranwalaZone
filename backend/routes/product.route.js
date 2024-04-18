import express from "express"
import { Router } from "express"
import { createProduct, getAllProducts, updateProduct } from "../controllers/product.controller.js";

const userRouter = Router();

userRouter.route("/products").get(getAllProducts);
userRouter.route("/products/new").post(createProduct);
userRouter.route("/products/:id").put(updateProduct);

export {userRouter}