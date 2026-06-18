import { db } from "../../core/db.js";
import { notifications } from "./notifications.schema.js";
import { eq, and, desc } from "drizzle-orm";
import { HttpException } from "../../core/errorHandler.js";
export class NotificationsService {
    static async getUserNotifications(userId) {
        const userNotifications = await db
            .select()
            .from(notifications)
            .where(eq(notifications.userId, userId))
            .orderBy(desc(notifications.createdAt));
        return userNotifications;
    }
    static async markAsRead(notificationId, userId) {
        const [notification] = await db
            .select()
            .from(notifications)
            .where(and(eq(notifications.id, notificationId), eq(notifications.userId, userId)));
        if (!notification) {
            throw new HttpException("Notificação não encontrada", 404);
        }
        const [updated] = await db
            .update(notifications)
            .set({ read: true })
            .where(eq(notifications.id, notificationId))
            .returning();
        return updated;
    }
    static async markAllAsRead(userId) {
        await db
            .update(notifications)
            .set({ read: true })
            .where(eq(notifications.userId, userId));
        return { message: "Todas as notificações foram marcadas como lidas." };
    }
    static async getUnreadCount(userId) {
        const [result] = await db
            .select({ count: sql `COUNT(*)` })
            .from(notifications)
            .where(and(eq(notifications.userId, userId), eq(notifications.read, false)));
        return result?.count ?? 0;
    }
    static async createNotification(data) {
        const [notification] = await db
            .insert(notifications)
            .values(data)
            .returning();
        return notification;
    }
}
import { sql } from "drizzle-orm";
//# sourceMappingURL=notifications.service.js.map