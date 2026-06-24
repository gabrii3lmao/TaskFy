export declare class DashboardService {
    static getUserDashboard(userId: string): Promise<{
        stats: {
            activeProjects: number;
            totalTasks: number;
            teamMembers: number;
            overdueTasks: number;
        };
        tasks: {
            atrasadas: any[];
            venceHoje: any[];
            proximas: any[];
            concluidas: any[];
        };
        projects: {
            progress: number;
            deadlineStatus: string;
            id: string;
            title: string;
            deadline: Date;
            description: string;
            supervisorId: string;
            totalTasks: number;
            completedTasks: number;
        }[];
        recentActivity: {
            id: string;
            userId: string;
            type: "task_completed" | "delay_report" | "deadline_approaching" | "task_assigned" | "project_assigned" | "system";
            title: string;
            message: string;
            taskId: string | null;
            projectId: string | null;
            read: boolean;
            createdAt: Date;
        }[];
    }>;
}
//# sourceMappingURL=dashboard.service.d.ts.map