import type { Task } from "../../types/task.js";
export declare class TasksService {
    static getTasksByProject(projectId: string): Promise<{
        id: string;
        projectId: string;
        parentTaskId: string | null;
        title: string;
        description: string | null;
        deadline: Date;
        status: "not_started" | "in_progress" | "completed";
        deadlineStatus: "on_time" | "delayed" | "ahead";
        createdAt: Date;
    }[]>;
    static createTask(data: Task): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        description: string | null;
        deadline: Date;
        projectId: string;
        parentTaskId: string | null;
        status: "not_started" | "in_progress" | "completed";
        deadlineStatus: "on_time" | "delayed" | "ahead";
    } | undefined>;
    static updateTask(taskId: string, data: Partial<{
        title: string;
        description: string;
        deadline: Date;
        status: "not_started" | "in_progress" | "completed";
    }>, requestUserId: string): Promise<{
        id: string;
        projectId: string;
        parentTaskId: string | null;
        title: string;
        description: string | null;
        deadline: Date;
        status: "not_started" | "in_progress" | "completed";
        deadlineStatus: "on_time" | "delayed" | "ahead";
        createdAt: Date;
    } | undefined>;
    static deleteTask(taskId: string, requestUserId: string): Promise<{
        message: string;
    }>;
    static getSubtasks(taskId: string): Promise<{
        id: string;
        projectId: string;
        parentTaskId: string | null;
        title: string;
        description: string | null;
        deadline: Date;
        status: "not_started" | "in_progress" | "completed";
        deadlineStatus: "on_time" | "delayed" | "ahead";
        createdAt: Date;
    }[]>;
    static completeTask(task_id: string, requestUserId: string): Promise<{
        id: string;
        projectId: string;
        parentTaskId: string | null;
        title: string;
        description: string | null;
        deadline: Date;
        status: "not_started" | "in_progress" | "completed";
        deadlineStatus: "on_time" | "delayed" | "ahead";
        createdAt: Date;
    } | undefined>;
    static startTaskTimer(taskId: string, userId: string): Promise<{
        message: string;
    }>;
    static stopTaskTimer(taskId: string, userId: string): Promise<{
        message: string;
    }>;
    static reportDelay(taskId: string, userId: string, reason?: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=tasks.service.d.ts.map