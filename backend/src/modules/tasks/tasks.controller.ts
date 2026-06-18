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

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { taskId } = req.params;
      const userId = req.user?.id;
      const updateData = req.body;

      if (!userId) {
        throw new HttpException("Usuário não autenticado", 401);
      }

      const task = await TasksService.updateTask(
        taskId as string,
        updateData,
        userId,
      );
      res.status(200).json({ status: "success", data: task });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { taskId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        throw new HttpException("Usuário não autenticado", 401);
      }

      const result = await TasksService.deleteTask(
        taskId as string,
        userId,
      );
      res.status(200).json({ status: "success", data: result });
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

  static async getSubtasks(req: Request, res: Response, next: NextFunction) {
    try {
      const { taskId } = req.params;

      const subtasks = await TasksService.getSubtasks(taskId as string);

      res.status(200).json({ status: "success", data: subtasks });
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
      const dashboardData =
        await TasksDashboardService.getUserDashboard(userId);
      res.status(200).json({ status: "success", data: dashboardData });
    } catch (error) {
      next(error);
    }
  }

  static async getTasksByProject(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { projectId } = req.query;

      if (!projectId) {
        throw new HttpException("Projeto não encontrado", 404);
      }
      const tasks = await TasksService.getTasksByProject(projectId as string);
      res.status(200).json({ status: "success", data: tasks });
    } catch (error) {
      next(error);
    }
  }

  static async getMyTasks(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new HttpException("Usuário não autenticado", 401);
      }
      const tasks = await TasksDashboardService.getUserTasks(userId);
      res.status(200).json({ status: "success", data: tasks });
    } catch (error) {
      next(error);
    }
  }

  static async reportDelay(req: Request, res: Response, next: NextFunction) {
    try {
      const { taskId } = req.params;
      const userId = req.user?.id;
      const { reason } = req.body;

      if (!userId) {
        throw new HttpException("Usuário não autenticado", 401);
      }

      const result = await TasksService.reportDelay(
        taskId as string,
        userId,
        reason,
      );

      res.status(200).json({ status: "success", data: result });
    } catch (error) {
      next(error);
    }
  }
}
