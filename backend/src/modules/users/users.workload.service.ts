import { db, teamMembers } from "../../core/db.js";
import { users } from "./users.schema.js";
import { timeLogs } from "../tasks/tasks.schema.js";
import { eq, sql } from "drizzle-orm";

export class WorkloadService {
  static async getWorkloadBalance(teamId: string) {
    const workloadData = await db
      .select({
        id: users.id,
        name: users.name,
        avaliableHours: users.availableHours,
        usedHours:
          sql<number>`COALESCE(SUM(EXTRACT(EPOCH FROM (time_logs.end_time - time_logs.start_time)))  / 3600, 0)`.mapWith(
            Number,
          ),
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
      } else if (percentage > 100) {
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
}
