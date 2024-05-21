import { Router } from "express";
import { allCoupons, applyDiscount, deleteCoupon, newCoupon } from "../controllers/payment.controller.js";
import { authorizeRoles } from "../middlewares/auth.js";

export const paymentRouter = Router();

paymentRouter.route("/discount").get(applyDiscount);
paymentRouter.route("/coupon/new").post(authorizeRoles("admin") ,newCoupon);
paymentRouter.route("/all").get(authorizeRoles("admin") ,allCoupons);
paymentRouter.route("/delete/:id").delete(authorizeRoles("admin") ,deleteCoupon);
