export declare class WorkloadService {
    static getWorkloadBalance(teamId: string): Promise<{
        usedHours: number;
        percentage: number;
        statusColor: string;
        id: string;
        name: string;
        avaliableHours: number;
    }[]>;
    static getTeamMemberTaskBreakdown(teamId: string): Promise<{
        id: string;
        name: string;
        totalTasks: number;
        completedTasks: number;
        inProgressTasks: number;
        pendingTasks: number;
    }[]>;
}
//# sourceMappingURL=users.workload.service.d.ts.map