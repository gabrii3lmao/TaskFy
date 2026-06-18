import { db } from "../../core/db.js";
import { notifications } from "./notifications.schema.js";
import { eq, and, desc } from "drizzle-orm";
import { HttpException } from "../../core/errorHandler.js";

export class NotificationsService {
  static async getUserNotifications(userId: string) {
    const userNotifications = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));

    return userNotifications;
  }

  static async markAsRead(notificationId: string, userId: string) {
    const [notification] = await db
      .select()
      .from(notifications)
      .where(
        and(
          eq(notifications.id, notificationId),
          eq(notifications.userId, userId),
        ),
      );

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

  static async markAllAsRead(userId: string) {
    await db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.userId, userId));

    return { message: "Todas as notificações foram marcadas como lidas." };
  }

  static async getUnreadCount(userId: string) {
    const [result] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(notifications)
      .where(
        and(eq(notifications.userId, userId), eq(notifications.read, false)),
      );

    return result?.count ?? 0;
  }

  static async createNotification(data: {
    userId: string;
    type: string;
    title: string;
    message: string;
    taskId?: string;
    projectId?: string;
  }) {
    const [notification] = await db
      .insert(notifications)
      .values(data as any)
      .returning();

    return notification;
  }
}

import { sql } from "drizzle-orm";
