import type { Project } from "../../types/project.js";
export declare class ProjectsService {
    static createProject(data: Project): Promise<{
        id: string;
        createdAt: Date;
        teamId: string;
        title: string;
        description: string;
        deadline: Date;
        supervisorId: string;
    } | undefined>;
    static deleteProject(projectId: string, requestUserId: string): Promise<{
        message: string;
    }>;
    static getUsersProjects(userId: string): Promise<{
        progress: number;
        deadlineStatus: string;
        id: string;
        title: string;
        deadline: Date;
        description: string;
        supervisorId: string;
        totalTasks: number;
        completedTasks: number;
    }[]>;
}
//# sourceMappingURL=projects.service.d.ts.map