import { Router } from "express";
import { teamsRouter } from "../modules/teams/teams.routes.js";
import { tasksRouter } from "../modules/tasks/tasks.routes.js";
import { projectsRouter } from "../modules/projects/projects.routes.js";
import { usersRouter } from "../modules/users/users.routes.js";
import { notificationsRouter } from "../modules/notifications/notifications.routes.js";

import authRouter from "../modules/auth/auth.routes.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/teams", teamsRouter);
router.use("/projects", projectsRouter);
router.use("/tasks", tasksRouter);
router.use("/users", usersRouter);
router.use("/notifications", notificationsRouter);

export default router;
