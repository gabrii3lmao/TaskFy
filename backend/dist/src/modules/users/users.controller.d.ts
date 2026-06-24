import type { Request, Response, NextFunction } from "express";
export declare class UsersController {
    static searchUsers(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static getUsersWorkloadBalance(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static getTeamMemberTaskBreakdown(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=users.controller.d.ts.map