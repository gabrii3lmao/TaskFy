import { Router } from "express";
import { TeamsController } from "./teams.controller.js";
import { requireAuth } from "../../middlewares/authMiddleware.js";
import { validate } from "../../middlewares/validationMiddleware.js";
import { z } from "zod";

const createTeamSchema = z.object({
  body: z.object({
    name: z.string().min(3, "O nome da equipe deve ter no mínimo 3 caracteres"),
  }),
});

const teamsRouter = Router();

teamsRouter.post(
  "/",
  requireAuth,
  validate(createTeamSchema),
  TeamsController.create,
);

export { teamsRouter };
