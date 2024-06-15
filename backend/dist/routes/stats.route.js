import { Router } from "express";
import { adminOnly } from "../middlewares/auth.js";
import { getBartChart, getDashboardStats, getLineChart, getPieChart } from "../controllers/stats.controller.js";
export const dashboardRouter = Router();
dashboardRouter.route("/stats").get(adminOnly, getDashboardStats);
dashboardRouter.route("/pie").get(adminOnly, getPieChart);
dashboardRouter.route("/bar").get(adminOnly, getBartChart);
dashboardRouter.route("/line").get(adminOnly, getLineChart);
