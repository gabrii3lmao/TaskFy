import { Router } from "express";
import { validate } from "../../middlewares/validationMiddleware.js";
import { requireAuth } from "../../middlewares/authMiddleware.js";
import { TasksController } from "./tasks.controller.js";
import { createTaskSchema } from "./tasks.schema.js";

const tasksRouter = Router();

tasksRouter.use(requireAuth);

tasksRouter.get("/dashboard", TasksController.getDashboard);
tasksRouter.post("/", validate(createTaskSchema), TasksController.create);

tasksRouter.patch("/:taskId/complete", TasksController.complete);
tasksRouter.post("/:taskId/start", TasksController.startTimer);
tasksRouter.post("/:taskId/stop", TasksController.stopTimer);

export { tasksRouter };
