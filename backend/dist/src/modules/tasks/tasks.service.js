import { db } from "../../core/db.js";
import { tasks, taskAssignees, timeLogs } from "./tasks.schema.js";
import { projects } from "../projects/projects.schema.js";
import { users } from "../users/users.schema.js";
import { and, eq, isNull } from "drizzle-orm";
import { HttpException } from "../../core/errorHandler.js";
import { NotificationsService } from "../notifications/notifications.service.js";
export class TasksService {
    static async getTasksByProject(projectId) {
        const projectTasks = await db
            .select()
            .from(tasks)
            .where(eq(tasks.projectId, projectId));
        return projectTasks;
    }
    static async createTask(data) {
        return db.transaction(async (tx) => {
            const [newTask] = await tx.insert(tasks).values(data).returning();
            if (data.assigneeIds && data.assigneeIds.length > 0) {
                const assigneeIds = data.assigneeIds.map((userId) => ({
                    taskId: newTask.id,
                    userId,
                }));
                await tx.insert(taskAssignees).values(assigneeIds);
            }
            return newTask;
        });
    }
    static async updateTask(taskId, data, requestUserId) {
        const [isAssignee] = await db
            .select()
            .from(taskAssignees)
            .where(and(eq(taskAssignees.taskId, taskId), eq(taskAssignees.userId, requestUserId)));
        if (!isAssignee) {
            throw new HttpException("Acesso negado: Apenas encarregados pela tarefa podem editá-la.", 403);
        }
        const [updatedTask] = await db
            .update(tasks)
            .set(data)
            .where(eq(tasks.id, taskId))
            .returning();
        return updatedTask;
    }
    static async deleteTask(taskId, requestUserId) {
        const [isAssignee] = await db
            .select()
            .from(taskAssignees)
            .where(and(eq(taskAssignees.taskId, taskId), eq(taskAssignees.userId, requestUserId)));
        if (!isAssignee) {
            throw new HttpException("Acesso negado: Apenas encarregados podem excluir a tarefa.", 403);
        }
        await db.delete(tasks).where(eq(tasks.id, taskId));
        return { message: "Tarefa excluída com sucesso." };
    }
    static async getSubtasks(taskId) {
        const subtasks = await db
            .select()
            .from(tasks)
            .where(eq(tasks.parentTaskId, taskId));
        return subtasks;
    }
    static async completeTask(task_id, requestUserId) {
        const [isAssignee] = await db
            .select()
            .from(taskAssignees)
            .where(and(eq(taskAssignees.taskId, task_id), eq(taskAssignees.userId, requestUserId)));
        if (!isAssignee) {
            throw new HttpException("Acesso negado: Apenas os encarregados pela tarefa podem concluí-la.", 403);
        }
        const [updatedTask] = await db
            .update(tasks)
            .set({
            status: "completed",
        })
            .where(eq(tasks.id, task_id))
            .returning();
        return updatedTask;
    }
    static async startTaskTimer(taskId, userId) {
        const [isAssignee] = await db
            .select()
            .from(taskAssignees)
            .where(and(eq(taskAssignees.taskId, taskId), eq(taskAssignees.userId, userId)));
        if (!isAssignee)
            throw new HttpException("Apenas encarregados podem iniciar a tarefa.", 403);
        const [activeTimer] = await db
            .select()
            .from(timeLogs)
            .where(and(eq(timeLogs.taskId, taskId), eq(timeLogs.userId, userId), isNull(timeLogs.endTime)));
        if (activeTimer) {
            throw new HttpException("Esta tarefa já possui um cronômetro ativo.", 400);
        }
        await db.transaction(async (tx) => {
            await tx
                .update(tasks)
                .set({ status: "in_progress" })
                .where(eq(tasks.id, taskId));
            await tx.insert(timeLogs).values({
                taskId,
                userId,
            });
        });
        return { message: "Cronômetro iniciado com sucesso." };
    }
    static async stopTaskTimer(taskId, userId) {
        const [activeTimer] = await db
            .select()
            .from(timeLogs)
            .where(and(eq(timeLogs.taskId, taskId), eq(timeLogs.userId, userId), isNull(timeLogs.endTime)));
        if (!activeTimer) {
            throw new HttpException("Não há um cronômetro ativo para esta tarefa.", 400);
        }
        await db
            .update(timeLogs)
            .set({ endTime: new Date() })
            .where(eq(timeLogs.id, activeTimer.id));
        return { message: "Cronômetro pausado com sucesso." };
    }
    static async reportDelay(taskId, userId, reason) {
        const [task] = await db
            .select()
            .from(tasks)
            .where(eq(tasks.id, taskId));
        if (!task) {
            throw new HttpException("Tarefa não encontrada", 404);
        }
        const [project] = await db
            .select()
            .from(projects)
            .where(eq(projects.id, task.projectId));
        if (!project) {
            throw new HttpException("Projeto não encontrado", 404);
        }
        const [userInfo] = await db
            .select({ name: users.name })
            .from(users)
            .where(eq(users.id, userId));
        const employeeName = userInfo?.name ?? "Um funcionário";
        await NotificationsService.createNotification({
            userId: project.supervisorId,
            type: "delay_report",
            title: "Possível atraso reportado",
            message: `${employeeName} reportou um possível atraso na tarefa "${task.title}"${reason ? `: ${reason}` : "."}`,
            taskId: task.id,
            projectId: project.id,
        });
        return { message: "Alerta de atraso enviado ao supervisor com sucesso." };
    }
}
//# sourceMappingURL=tasks.service.js.map