import express from "express";
import { allOrders, deleteOrder, myOrders, newOrder, processOrder, singleOrder } from "../controllers/order.controller.js";
import { adminOnly } from "../middlewares/auth.js";
export const orderRouter = express.Router();
orderRouter.route("/new").post(newOrder);
orderRouter.route("/myOrders").get(myOrders);
orderRouter.route("/allOrders").get(adminOnly, allOrders);
orderRouter.route("/:id")
    .get(singleOrder)
    .put(adminOnly, processOrder)
    .delete(adminOnly, deleteOrder);
