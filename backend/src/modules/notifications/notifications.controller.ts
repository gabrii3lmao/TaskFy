import type { Request, Response, NextFunction } from "express";
import { NotificationsService } from "./notifications.service.js";
import { HttpException } from "../../core/errorHandler.js";

export class NotificationsController {
  static async getUserNotifications(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = req.user?.id;
      if (!userId) throw new HttpException("Usuário não autenticado", 401);

      const notifications =
        await NotificationsService.getUserNotifications(userId);

      res.status(200).json({ status: "success", data: notifications });
    } catch (error) {
      next(error);
    }
  }

  static async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const { id } = req.params;
      if (!userId) throw new HttpException("Usuário não autenticado", 401);

      const notification = await NotificationsService.markAsRead(
        id as string,
        userId,
      );

      res.status(200).json({ status: "success", data: notification });
    } catch (error) {
      next(error);
    }
  }

  static async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) throw new HttpException("Usuário não autenticado", 401);

      const result = await NotificationsService.markAllAsRead(userId);

      res.status(200).json({ status: "success", data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getUnreadCount(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = req.user?.id;
      if (!userId) throw new HttpException("Usuário não autenticado", 401);

      const count = await NotificationsService.getUnreadCount(userId);

      res.status(200).json({ status: "success", data: { count } });
    } catch (error) {
      next(error);
    }
  }
}
