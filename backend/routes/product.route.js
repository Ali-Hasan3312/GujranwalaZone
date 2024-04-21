import express from "express"
import { Router } from "express"
import { createProduct, deleteProduct, getAllProducts, productDetails, updateProduct } from "../controllers/product.controller.js";

const productRouter = Router();

productRouter.route("/products").get(getAllProducts);
productRouter.route("/products/new").post(createProduct);
productRouter.route("/products/:id").put(updateProduct).delete(deleteProduct).get(productDetails);

export {productRouter}