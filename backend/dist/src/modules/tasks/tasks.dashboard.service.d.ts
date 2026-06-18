export declare class TasksDashboardService {
    static getUserDashboard(userId: string): Promise<{
        atrasadas: any[];
        venceHoje: any[];
        proximas: any[];
        concluidas: any[];
    }>;
    static getUserTasks(userId: string): Promise<{
        id: string;
        title: string;
        description: string | null;
        status: "not_started" | "in_progress" | "completed";
        deadline: Date;
        projectId: string;
        parentTaskId: string | null;
        projectName: string;
    }[]>;
}
//# sourceMappingURL=tasks.dashboard.service.d.ts.map