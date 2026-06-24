import { db, teamMembers } from "../../core/db.js";
import { users } from "./users.schema.js";
import { timeLogs, tasks, taskAssignees } from "../tasks/tasks.schema.js";
import { projects } from "../projects/projects.schema.js";
import { eq, and, sql } from "drizzle-orm";
export class WorkloadService {
    static async getWorkloadBalance(teamId) {
        const workloadData = await db
            .select({
            id: users.id,
            name: users.name,
            avaliableHours: users.availableHours,
            usedHours: sql `COALESCE(SUM(EXTRACT(EPOCH FROM (time_logs.end_time - time_logs.start_time)))  / 3600, 0)`.mapWith(Number),
        })
            .from(users)
            .innerJoin(teamMembers, eq(users.id, teamMembers.userId))
            .leftJoin(timeLogs, eq(users.id, timeLogs.userId))
            .where(eq(teamMembers.teamId, teamId))
            .groupBy(users.id, users.name, users.availableHours);
        const report = workloadData.map((user) => {
            const avaliable = user.avaliableHours || 1;
            const percentage = Math.round((user.usedHours / avaliable) * 100);
            let statusColor = "green";
            if (percentage >= 75 && percentage <= 100) {
                statusColor = "yellow";
            }
            else if (percentage > 100) {
                statusColor = "red";
            }
            return {
                ...user,
                usedHours: Number(user.usedHours.toFixed(2)),
                percentage,
                statusColor,
            };
        });
        return report;
    }
    static async getTeamMemberTaskBreakdown(teamId) {
        const breakdown = await db
            .select({
            id: users.id,
            name: users.name,
            totalTasks: sql `COUNT(*)`.mapWith(Number),
            completedTasks: sql `COUNT(*) FILTER (WHERE ${tasks.status} = 'completed')`.mapWith(Number),
            inProgressTasks: sql `COUNT(*) FILTER (WHERE ${tasks.status} = 'in_progress')`.mapWith(Number),
            pendingTasks: sql `COUNT(*) FILTER (WHERE ${tasks.status} = 'not_started')`.mapWith(Number),
        })
            .from(users)
            .innerJoin(teamMembers, and(eq(users.id, teamMembers.userId), eq(teamMembers.teamId, teamId)))
            .innerJoin(taskAssignees, eq(users.id, taskAssignees.userId))
            .innerJoin(tasks, eq(taskAssignees.taskId, tasks.id))
            .innerJoin(projects, and(eq(tasks.projectId, projects.id), eq(projects.teamId, teamId)))
            .groupBy(users.id, users.name);
        return breakdown;
    }
}
//# sourceMappingURL=users.workload.service.js.map