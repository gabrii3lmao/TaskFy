import { db } from "../../core/db.js";
import { projects } from "./projects.schema.js";
import { teamMembers } from "../teams/teams.schema.js";
import { and, eq, sql } from "drizzle-orm";
import { tasks } from "../tasks/tasks.schema.js";
import { HttpException, NotFoundException } from "../../core/errorHandler.js";
export class ProjectsService {
    static async createProject(data) {
        const [memberShip] = await db
            .select()
            .from(teamMembers)
            .where(and(eq(teamMembers.teamId, data.teamId), eq(teamMembers.userId, data.supervisorId)));
        if (!memberShip) {
            throw new HttpException("O supervisor selecionado não é membro da equipe responsável.", 400);
        }
        const [newProject] = await db.insert(projects).values(data).returning();
        return newProject;
    }
    static async deleteProject(projectId, requestUserId) {
        const [project] = await db
            .select()
            .from(projects)
            .where(eq(projects.id, projectId));
        if (!project) {
            throw new NotFoundException("Projeto não encontrado");
        }
        if (project.supervisorId !== requestUserId) {
            throw new HttpException("Acesso negado: Apenas o supervisor pode excluí-lo.", 403);
        }
        await db.delete(projects).where(eq(projects.id, projectId));
        return { message: "Projeto excluído com sucesso." };
    }
    static async getUsersProjects(userId) {
        const userProjects = await db
            .select({
            id: projects.id,
            title: projects.title,
            deadline: projects.deadline,
            description: projects.description,
            supervisorId: projects.supervisorId,
            totalTasks: sql `COUNT(${tasks.id})`.mapWith(Number),
            completedTasks: sql `COUNT(${tasks.id}) FILTER (WHERE ${tasks.status} = 'completed')`.mapWith(Number),
        })
            .from(projects)
            .innerJoin(teamMembers, and(eq(projects.teamId, teamMembers.teamId), eq(teamMembers.userId, userId)))
            .leftJoin(tasks, eq(projects.id, tasks.projectId))
            .groupBy(projects.id);
        return userProjects.map((project) => {
            const progress = project.totalTasks === 0
                ? 0
                : Math.round((project.completedTasks / project.totalTasks) * 100);
            const now = new Date();
            let deadlineStatus = "Em dia";
            if (project.deadline < now && progress < 100) {
                deadlineStatus = "Atrasado";
            }
            return {
                ...project,
                progress,
                deadlineStatus,
            };
        });
    }
}
//# sourceMappingURL=projects.service.js.map