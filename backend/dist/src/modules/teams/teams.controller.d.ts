import type { Request, Response, NextFunction } from "express";
export declare class TeamsController {
    static create(req: Request, res: Response, next: NextFunction): Promise<void>;
    static addMember(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getUsersTeams(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=teams.controller.d.ts.map