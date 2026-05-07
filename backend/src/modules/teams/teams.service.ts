import { db } from "../../core/db.js";
import { teams, teamMembers } from "./teams.schema.js";


export class TeamsService {
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
}
