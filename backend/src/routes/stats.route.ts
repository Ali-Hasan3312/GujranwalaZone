import { Router } from "express";
import { authorizeRoles, verifyJWT } from "../middlewares/auth.js";
import { getBartChart, getDashboardStats, getLineChart, getPieChart } from "../controllers/stats.controller.js";

export const dashboardRouter = Router();

dashboardRouter.route("/stats").get(verifyJWT,authorizeRoles("admin"),getDashboardStats);
dashboardRouter.route("/pie").get(verifyJWT,authorizeRoles("admin"),getPieChart);
dashboardRouter.route("/bar").get(verifyJWT,authorizeRoles("admin"),getBartChart);
dashboardRouter.route("/line").get(verifyJWT,authorizeRoles("admin"),getLineChart);