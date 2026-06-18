import type { Team } from "../../types/team.js";
export declare class TeamsService {
    static getUserTeams(userId: string): Promise<{
        id: string;
        name: string;
        role: "admin" | "member" | "supervisor";
        joinedAt: Date;
        createdAt: Date;
    }[]>;
    static createTeam(name: string, creatorUserId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    } | undefined>;
    static addMemberToTeam(data: Team): Promise<{
        id: string;
        teamId: string;
        userId: string;
        role: "admin" | "member" | "supervisor";
        joinedAt: Date;
    } | undefined>;
}
//# sourceMappingURL=teams.service.d.ts.map