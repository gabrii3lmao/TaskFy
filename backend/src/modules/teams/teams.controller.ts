import type { Request, Response, NextFunction } from "express";
import { TeamsService } from "./teams.service.js";
import { HttpException } from "../../core/errorHandler.js";

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
}
