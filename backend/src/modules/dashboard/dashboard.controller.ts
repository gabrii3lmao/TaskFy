import type { Request, Response, NextFunction } from "express";
import { DashboardService } from "./dashboard.service.js";
import { HttpException } from "../../core/errorHandler.js";

export class DashboardController {
  static async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new HttpException("Usuário não autenticado", 401);
      }
      const data = await DashboardService.getUserDashboard(userId);
      res.status(200).json({ status: "success", data });
    } catch (error) {
      next(error);
    }
  }
}
