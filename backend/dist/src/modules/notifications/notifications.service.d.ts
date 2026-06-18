export declare class NotificationsService {
    static getUserNotifications(userId: string): Promise<{
        id: string;
        userId: string;
        type: "task_completed" | "delay_report" | "deadline_approaching" | "task_assigned" | "project_assigned" | "system";
        title: string;
        message: string;
        taskId: string | null;
        projectId: string | null;
        read: boolean;
        createdAt: Date;
    }[]>;
    static markAsRead(notificationId: string, userId: string): Promise<{
        id: string;
        userId: string;
        type: "task_completed" | "delay_report" | "deadline_approaching" | "task_assigned" | "project_assigned" | "system";
        title: string;
        message: string;
        taskId: string | null;
        projectId: string | null;
        read: boolean;
        createdAt: Date;
    } | undefined>;
    static markAllAsRead(userId: string): Promise<{
        message: string;
    }>;
    static getUnreadCount(userId: string): Promise<number>;
    static createNotification(data: {
        userId: string;
        type: string;
        title: string;
        message: string;
        taskId?: string;
        projectId?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        type: "task_completed" | "delay_report" | "deadline_approaching" | "task_assigned" | "project_assigned" | "system";
        message: string;
        title: string;
        projectId: string | null;
        taskId: string | null;
        read: boolean;
    } | undefined>;
}
//# sourceMappingURL=notifications.service.d.ts.map