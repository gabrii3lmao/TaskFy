import { Router } from "express";
import { requireAuth } from "../../middlewares/authMiddleware.js";
import { NotificationsController } from "./notifications.controller.js";
const notificationsRouter = Router();
notificationsRouter.use(requireAuth);
notificationsRouter.get("/", NotificationsController.getUserNotifications);
notificationsRouter.get("/unread-count", NotificationsController.getUnreadCount);
notificationsRouter.patch("/:id/read", NotificationsController.markAsRead);
notificationsRouter.patch("/read-all", NotificationsController.markAllAsRead);
export { notificationsRouter };
//# sourceMappingURL=notifications.routes.js.map