import { and, eq } from "drizzle-orm";
import { db } from "../../core/db.js";
import type { Team } from "../../types/team.js";
import { teams, teamMembers } from "./teams.schema.js";
import { HttpException } from "../../core/errorHandler.js";

export class TeamsService {
  static async getUserTeams(userId: string) {
    const userTeams = await db
      .select({
        id: teams.id,
        name: teams.name,
        role: teamMembers.role,
        joinedAt: teamMembers.joinedAt,
        createdAt: teams.createdAt,
      })
      .from(teams)
      .innerJoin(teamMembers, eq(teams.id, teamMembers.teamId))
      .where(eq(teamMembers.userId, userId)); 

    return userTeams;
  }

  static async createTeam(name: string, creatorUserId: string) {
    const newTeam = await db.transaction(async (tx) => {
      const [insertedTeam] = await tx
        .insert(teams)
        .values({ name })
        .returning();

      await tx.insert(teamMembers).values({
        teamId: insertedTeam!.id,
        userId: creatorUserId,
        role: "admin",
      });
      return insertedTeam;
    });
    return newTeam;
  }

  static async addMemberToTeam(data: Team) {
    const [existingMember] = await db
      .select()
      .from(teamMembers)
      .where(
        and(
          eq(teamMembers.userId, data.userId),
          eq(teamMembers.teamId, data.teamId),
        ),
      );

    if (existingMember) {
      throw new HttpException("Este usuário já é membro desta equipe.", 400);
    }

    const [newMember] = await db.insert(teamMembers).values(data).returning();

    return newMember;
  }
}
