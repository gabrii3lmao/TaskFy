import { Router } from "express";
import { ProjectController } from "./projects.controller.js";
import { requireAuth } from "../../middlewares/authMiddleware.js";
import { validate } from "../../middlewares/validationMiddleware.js";
import { createProjectSchema } from "./projects.schema.js";

const projectsRouter = Router();

projectsRouter.post(
  "/",
  requireAuth,
  validate(createProjectSchema),
  ProjectController.create,
);

projectsRouter.delete("/:projectId", requireAuth, ProjectController.delete);

export { projectsRouter };
