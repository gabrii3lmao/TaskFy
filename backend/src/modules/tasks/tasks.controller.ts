import type { Request, Response, NextFunction } from "express";
import { TasksService } from "./tasks.service.js";
import { TasksDashboardService } from "./tasks.dashboard.service.js";
import { HttpException } from "../../core/errorHandler.js";

export class TasksController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const taskData = req.body;
      const task = await TasksService.createTask(taskData);

      res.status(201).json({ status: "success", data: task });
    } catch (error) {
      next(error);
    }
  }

  static async complete(req: Request, res: Response, next: NextFunction) {
    try {
      const { taskId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        throw new HttpException("Usuário não autenticado", 401);
      }

      const task = await TasksService.completeTask(taskId as string, userId);
      res.status(200).json({ status: "success", data: task });
    } catch (error) {
      next(error);
    }
  }

  static async startTimer(req: Request, res: Response, next: NextFunction) {
    try {
      const { taskId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        throw new HttpException("Usuário não autenticado", 401);
      }

      const result = await TasksService.startTaskTimer(
        taskId as string,
        userId,
      );
      res.status(200).json({ status: "success", data: result });
    } catch (error) {
      next(error);
    }
  }

  static async stopTimer(req: Request, res: Response, next: NextFunction) {
    try {
      const { taskId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        throw new HttpException("Usuário não autenticado", 401);
      }

      const result = await TasksService.stopTaskTimer(taskId as string, userId);

      res.status(200).json({ status: "success", data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new HttpException("Usuário não autenticado", 401);
      }
      const dashboardData = await TasksDashboardService.getUserDashboard(userId);
      res.status(200).json({ status: "success", data: dashboardData });
    } catch (error) {
      next(error);
    }
  }
}
