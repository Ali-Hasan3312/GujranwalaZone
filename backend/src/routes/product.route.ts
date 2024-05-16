import express from "express"
import {  deleteProduct, getAdminProducts, getAllCategories, getAllProducts, getSingleProduct, getlatestProducts, newProduct, updateProduct } from "../controllers/product.controller.js"
import { upload } from "../middlewares/multer.middleware.js";
import { authorizeRoles, verifyJWT } from "../middlewares/auth.js";

const productRouter = express.Router()
// To Create New Product
productRouter.route("/new").post(verifyJWT,authorizeRoles("admin"),upload,newProduct);
// To Get Last 10 products
productRouter.route("/latest").get(getlatestProducts);
//To get all unique categories
productRouter.route("/categories").get(getAllCategories);
// To get all products by admin
productRouter.route("/adminProducts").get(getAdminProducts)
// To Get Single product, Update product and Delete Product by ID
productRouter.route("/:id")
.get(getSingleProduct)
.put(upload,verifyJWT,authorizeRoles("admin"),updateProduct)
.delete(verifyJWT,authorizeRoles("admin"),deleteProduct);
// To get all products with filters,sort and pagination
productRouter.route("/all").post(getAllProducts)
export default productRouter;