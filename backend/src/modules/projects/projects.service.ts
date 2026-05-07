import { db } from "../../core/db.js";
import { projects } from "./projects.schema.js";
import { teamMembers } from "../teams/teams.schema.js";
import { and, eq } from "drizzle-orm";
import { HttpException } from "../../core/errorHandler.js";
import type { Project } from "../../types/project.js";

export class ProjectsService {
  static async createProject(data: Project) {
    const [memberShip] = await db
      .select()
      .from(teamMembers)
      .where(
        and(
          eq(teamMembers.teamId, data.teamId),
          eq(teamMembers.userId, data.supervisorId),
        ),
      );

    if (!memberShip) {
      throw new HttpException(
        "O supervisor selecionado não é membro da equipe responsável.",
        400,
      );
    }

    const [newProject] = await db.insert(projects).values(data).returning();

    return newProject;
  }
}
