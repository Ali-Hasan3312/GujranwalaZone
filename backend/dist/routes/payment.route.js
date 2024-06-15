import { Router } from "express";
import { allCoupons, applyDiscount, deleteCoupon, newCoupon } from "../controllers/payment.controller.js";
import { adminOnly } from "../middlewares/auth.js";
export const paymentRouter = Router();
paymentRouter.route("/discount").get(applyDiscount);
paymentRouter.route("/coupon/new").post(adminOnly, newCoupon);
paymentRouter.route("/all").get(adminOnly, allCoupons);
paymentRouter.route("/delete/:id").delete(adminOnly, deleteCoupon);
