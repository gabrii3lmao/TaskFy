import type { Request, Response, NextFunction } from "express";
import { TeamsService } from "./teams.service.js";
import { HttpException } from "../../core/errorHandler.js";
import { string } from "zod";

export class TeamsController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        throw new HttpException("Usuário não autenticado", 401);
      }

      const team = await TeamsService.createTeam(name, userId);
      res.status(201).json({ status: "success", data: team });
    } catch (error) {
      next(error);
    }
  }

  static async addMember(req: Request, res: Response, next: NextFunction) {
    try {
      const teamId = req.params.teamId as string;
      const { userId, role } = req.body;

      const member = await TeamsService.addMemberToTeam({
        teamId,
        userId,
        role,
      });

      res.status(201).json({ status: "success", data: member });
    } catch (error) {
      next(error);
    }
  }

  static async getUsersTeams(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new HttpException("Usuário não autenticado", 401);
      }

      const userTeams = await TeamsService.getUserTeams(userId);
      res.status(200).json({ status: "success", data: userTeams });
    } catch (error) {
      next(error);
    }
  }
}
