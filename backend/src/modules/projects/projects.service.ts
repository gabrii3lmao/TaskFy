import { db } from "../../core/db.js";
import { projects } from "./projects.schema.js";
import { teamMembers } from "../teams/teams.schema.js";
import { and, eq } from "drizzle-orm";
import { HttpException, NotFoundException } from "../../core/errorHandler.js";
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

  static async deleteProject(projectId: string, requestUserId: string) {
    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId));

    if (!project) {
      throw new NotFoundException("Projeto não encontrado");
    }

    if (project.supervisorId !== requestUserId) {
      throw new HttpException(
        "Acesso negado: Apenas o supervisor pode excluí-lo.",
        403,
      );
    }

    await db.delete(projects).where(eq(projects.id, projectId));

    return { message: "Projeto excluído com sucesso." };
  }
}
