import { Router } from "express";
import { DashboardController } from "./dashboard.controller.js";
import { requireAuth } from "../../middlewares/authMiddleware.js";
const dashboardRouter = Router();
dashboardRouter.get("/", requireAuth, DashboardController.getDashboard);
export default dashboardRouter;
//# sourceMappingURL=dashboard.routes.js.map