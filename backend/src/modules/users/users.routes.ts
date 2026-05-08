import Router from "express";
import { requireAuth } from "../../middlewares/authMiddleware.js";
import { UsersController } from "./users.controller.js";
import { WorkloadService } from "./users.workload.service.js";

const usersRouter = Router();

usersRouter.get("/search", requireAuth, UsersController.searchUsers);
usersRouter.get("/workload", requireAuth, WorkloadService.getWorkloadBalance);

export { usersRouter };
