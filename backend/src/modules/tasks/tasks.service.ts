import { db } from "../../core/db.js";
import { tasks, taskAssignees } from "./tasks.schema.js";
import { and, eq } from "drizzle-orm";
import { HttpException } from "../../core/errorHandler.js";
import type { Task } from "../../types/task.js";

export class TasksService {
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
}
