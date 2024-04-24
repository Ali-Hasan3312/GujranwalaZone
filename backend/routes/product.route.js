import express from "express"
import { Router } from "express"
import { createProduct, createProductReview, deleteProduct, getAllProducts, productDetails, updateProduct } from "../controllers/product.controller.js";
import { authorizeRoles, verifyJWT } from "../midlewares/auth.middleware.js";
const productRouter = Router();

productRouter.route("/products").get(getAllProducts);
productRouter.route("/admin/products/new").post(verifyJWT,authorizeRoles("admin"),createProduct);
productRouter.route("/admin/products/:id")
.put(verifyJWT,authorizeRoles("admin"),updateProduct)
.delete(verifyJWT,authorizeRoles("admin"),deleteProduct)
productRouter.route("/products/:id").get(productDetails);
productRouter.route("/review").put(verifyJWT, createProductReview)

export {productRouter}