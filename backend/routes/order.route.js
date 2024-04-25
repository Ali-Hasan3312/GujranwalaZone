import {Router} from "express"
import { authorizeRoles, verifyJWT } from "../midlewares/auth.middleware.js";
import { deleteOrder, getSingleOrder, myOrders, newOrder, updateOrder } from "../controllers/order.controller.js";
const orderRouter = Router();
orderRouter.route("/order/new").post(verifyJWT, newOrder)
orderRouter.route("/order/:id").get(verifyJWT,getSingleOrder);
orderRouter.route("/orders/me").get(verifyJWT, myOrders);
orderRouter.route("/admin/order/:id")
.put(verifyJWT, authorizeRoles("admin"),updateOrder)
.delete(verifyJWT, authorizeRoles("admin"),deleteOrder)
export {orderRouter}