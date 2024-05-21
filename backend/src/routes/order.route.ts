import express from "express"
import { allOrders, deleteOrder, myOrders, newOrder, processOrder, singleOrder } from "../controllers/order.controller.js";
import { authorizeRoles, verifyJWT } from "../middlewares/auth.js";

export const orderRouter = express.Router();

orderRouter.route("/new").post(verifyJWT,newOrder);
orderRouter.route("/myOrders").get(verifyJWT,myOrders)
orderRouter.route("/allOrders").get(verifyJWT,authorizeRoles("admin"),allOrders);
orderRouter.route("/singleOrder/:id")
.get(verifyJWT,authorizeRoles("admin"),singleOrder)
.put(verifyJWT,authorizeRoles("admin"),processOrder)
.delete(verifyJWT,authorizeRoles("admin"),deleteOrder)