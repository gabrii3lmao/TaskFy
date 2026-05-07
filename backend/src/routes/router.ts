import { Router } from "express";
import { teamsRouter } from "../modules/teams/teams.routes.js";
import authRouter from "../modules/auth/auth.routes.js";


const router = Router();

router.use("/auth", authRouter);
router.use("/teams", teamsRouter);

export default router;