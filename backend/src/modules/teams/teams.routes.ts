import { Router } from "express";
import { TeamsController } from "./teams.controller.js";
import { requireAuth } from "../../middlewares/authMiddleware.js";
import { validate } from "../../middlewares/validationMiddleware.js";
import { z } from "zod";
import { addMemberSchema } from "./teams.schema.js";

const createTeamSchema = z.object({
  body: z.object({
    name: z.string().min(3, "O nome da equipe deve ter no mínimo 3 caracteres"),
  }),
});

const teamsRouter = Router();

teamsRouter.get("/", requireAuth, TeamsController.getUsersTeams);
teamsRouter.post(
  "/",
  requireAuth,
  validate(createTeamSchema),
  TeamsController.create,
);

teamsRouter.post(
  "/:teamId/members",
  requireAuth,
  validate(addMemberSchema),
  TeamsController.addMember,
);

export { teamsRouter };
