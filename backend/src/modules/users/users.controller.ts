import { UsersService } from "./users.service.js";
import type { Request, Response, NextFunction } from "express";
import { WorkloadService } from "./users.workload.service.js";
import { HttpException } from "../../core/errorHandler.js";

export class UsersController {
  static async searchUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const searchQuery = req.query.q as string;
      if (!searchQuery) {
        return res.json({ status: "sucess", data: [] });
      }

      const usersList = await UsersService.searchUsers(searchQuery);
      return res.json({ status: "sucess", data: usersList });
    } catch (error) {
      next(error);
    }
  }

  static async getUsersWorkloadBalance(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { teamId } = req.query;

      if (!teamId) {
        throw new HttpException(
          "O ID da equipe é obrigatório para calcular a carga de trabalho.",
          400,
        );
      }

      const workloadBalance = await WorkloadService.getWorkloadBalance(
        teamId as string,
      );
      return res.status(200).json({ status: "success", data: workloadBalance });
    } catch (error) {
      next(error);
    }
  }
}
