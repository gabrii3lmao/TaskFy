import { db } from "../../core/db.js";
import { teamMembers } from "../teams/teams.schema.js";
import { tasks, taskAssignees } from "../tasks/tasks.schema.js";
import { projects } from "../projects/projects.schema.js";
import { notifications } from "../notifications/notifications.schema.js";
import { sql, eq, and, inArray, desc } from "drizzle-orm";
import { ProjectsService } from "../projects/projects.service.js";
import { TasksDashboardService } from "../tasks/tasks.dashboard.service.js";

export class DashboardService {
  static async getUserDashboard(userId: string) {
    const userTeams = await db
      .select({ id: teamMembers.teamId })
      .from(teamMembers)
      .where(eq(teamMembers.userId, userId));

    const teamIds = userTeams.map((t) => t.id);

    const [memberCountResult] =
      teamIds.length > 0
        ? await db
            .select({ count: sql<number>`COUNT(DISTINCT ${teamMembers.userId})` })
            .from(teamMembers)
            .where(inArray(teamMembers.teamId, teamIds))
        : [{ count: 0 }];

    const [totalTasksResult] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(taskAssignees)
      .where(eq(taskAssignees.userId, userId));

    const teamMembersCount = memberCountResult?.count ?? 0;
    const totalTasksCount = totalTasksResult?.count ?? 0;

    const projectsList = await ProjectsService.getUsersProjects(userId);
    const dashboardTasks = await TasksDashboardService.getUserDashboard(userId);

    const recentNotifications = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(10);

    return {
      stats: {
        activeProjects: projectsList.length,
        totalTasks: totalTasksCount,
        teamMembers: teamMembersCount,
        overdueTasks: dashboardTasks.atrasadas.length,
      },
      tasks: dashboardTasks,
      projects: projectsList,
      recentActivity: recentNotifications,
    };
  }
}
