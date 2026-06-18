import type { Request, Response, NextFunction } from "express";
export declare class NotificationsController {
    static getUserNotifications(req: Request, res: Response, next: NextFunction): Promise<void>;
    static markAsRead(req: Request, res: Response, next: NextFunction): Promise<void>;
    static markAllAsRead(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getUnreadCount(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=notifications.controller.d.ts.map