import express from "express"
import { Router } from "express"
import { getAllProducts } from "../controllers/product.controller.js";
const userRouter = Router();

userRouter.route("/products").get(getAllProducts)

export {userRouter}