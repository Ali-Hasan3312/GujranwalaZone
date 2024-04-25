import { Router } from "express"
import { createProduct, createProductReview, deleteProduct, deleteReview, getAllProducts, productDetails, productReviews, updateProduct } from "../controllers/product.controller.js";
import { authorizeRoles, verifyJWT } from "../midlewares/auth.middleware.js";
const productRouter = Router();

productRouter.route("/products").get(getAllProducts);
productRouter.route("/admin/products/new").post(verifyJWT,authorizeRoles("admin"),createProduct);
productRouter.route("/admin/products/:id")
.put(verifyJWT,authorizeRoles("admin"),updateProduct)
.delete(verifyJWT,authorizeRoles("admin"),deleteProduct)
productRouter.route("/products/:id").get(productDetails);
productRouter.route("/review").put(verifyJWT, createProductReview)
productRouter.route("/allreviews").get(verifyJWT, productReviews).delete(deleteReview)

export {productRouter}