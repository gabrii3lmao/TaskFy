import { db } from "../../core/db.js";
import { tasks, taskAssignees } from "./tasks.schema.js";
import { projects } from "../projects/projects.schema.js";
import { eq, and, ne } from "drizzle-orm";

export class TasksDashboardService {
  static async getUserDashboard(userId: string) {
    const userTasks = await this.getUserTasks(userId);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dashboard = {
      atrasadas: [] as any[],
      venceHoje: [] as any[],
      proximas: [] as any[],
      concluidas: [] as any[],
    };

    userTasks.forEach((task) => {
      if (task.status === "completed") {
        dashboard.concluidas.push(task);
        return;
      }
      const taskDate = new Date(task.deadline);
      taskDate.setHours(0, 0, 0, 0);

      if (taskDate < today) {
        dashboard.atrasadas.push(task);
      } else if (taskDate.getTime() === today.getTime()) {
        dashboard.venceHoje.push(task);
      } else {
        dashboard.proximas.push(task);
      }
    });

    return dashboard;
  }

  static async getUserTasks(userId: string) {
    const userTasks = await db
      .select({
        id: tasks.id,
        title: tasks.title,
        description: tasks.description,
        status: tasks.status,
        deadline: tasks.deadline,
        projectId: tasks.projectId,
        parentTaskId: tasks.parentTaskId,
        projectName: projects.title,
      })
      .from(tasks)
      .innerJoin(taskAssignees, eq(tasks.id, taskAssignees.taskId))
      .innerJoin(projects, eq(tasks.projectId, projects.id))
      .where(eq(taskAssignees.userId, userId));

    return userTasks;
  }
}
