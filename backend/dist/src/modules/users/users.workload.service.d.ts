export declare class WorkloadService {
    static getWorkloadBalance(teamId: string): Promise<{
        usedHours: number;
        percentage: number;
        statusColor: string;
        id: string;
        name: string;
        avaliableHours: number;
    }[]>;
}
//# sourceMappingURL=users.workload.service.d.ts.map