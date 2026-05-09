import { db } from "../../core/db.js";
import { tasks, taskAssignees, timeLogs } from "./tasks.schema.js";
import { and, eq, isNull } from "drizzle-orm";
import { HttpException } from "../../core/errorHandler.js";
import type { Task } from "../../types/task.js";

export class TasksService {
  static async getTasksByProject(projectId: string) {
    const projectTasks = await db
      .select()
      .from(tasks)
      .where(eq(tasks.projectId, projectId));
      
    return projectTasks;
  }
  static async createTask(data: Task) {
    return db.transaction(async (tx) => {
      const [newTask] = await tx.insert(tasks).values(data).returning();

      if (data.assigneeIds && data.assigneeIds.length > 0) {
        const assigneeIds = data.assigneeIds.map((userId) => ({
          taskId: newTask!.id,
          userId,
        }));

        await tx.insert(taskAssignees).values(assigneeIds);
      }
      return newTask;
    });
  }

  static async completeTask(task_id: string, requestUserId: string) {
    const [isAssignee] = await db
      .select()
      .from(taskAssignees)
      .where(
        and(
          eq(taskAssignees.taskId, task_id),
          eq(taskAssignees.userId, requestUserId),
        ),
      );

    if (!isAssignee) {
      throw new HttpException(
        "Acesso negado: Apenas os encarregados pela tarefa podem concluí-la.",
        403,
      );
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

  static async startTaskTimer(taskId: string, userId: string) {
    const [isAssignee] = await db
      .select()
      .from(taskAssignees)
      .where(
        and(eq(taskAssignees.taskId, taskId), eq(taskAssignees.userId, userId)),
      );

    if (!isAssignee)
      throw new HttpException(
        "Apenas encarregados podem iniciar a tarefa.",
        403,
      );

    const [activeTimer] = await db
      .select()
      .from(timeLogs)
      .where(
        and(
          eq(timeLogs.taskId, taskId),
          eq(timeLogs.userId, userId),
          isNull(timeLogs.endTime),
        ),
      );

    if (activeTimer) {
      throw new HttpException(
        "Esta tarefa já possui um cronômetro ativo.",
        400,
      );
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

  static async stopTaskTimer(taskId: string, userId: string) {
    const [activeTimer] = await db
      .select()
      .from(timeLogs)
      .where(
        and(
          eq(timeLogs.taskId, taskId),
          eq(timeLogs.userId, userId),
          isNull(timeLogs.endTime),
        ),
      );

    if (!activeTimer) {
      throw new HttpException(
        "Não há um cronômetro ativo para esta tarefa.",
        400,
      );
    }

    await db
      .update(timeLogs)
      .set({ endTime: new Date() })
      .where(eq(timeLogs.id, activeTimer.id));

    return { message: "Cronômetro pausado com sucesso." };
  }
}
