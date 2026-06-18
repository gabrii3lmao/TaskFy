import type { Request, Response, NextFunction } from "express";
export declare class TasksController {
    static create(req: Request, res: Response, next: NextFunction): Promise<void>;
    static update(req: Request, res: Response, next: NextFunction): Promise<void>;
    static delete(req: Request, res: Response, next: NextFunction): Promise<void>;
    static complete(req: Request, res: Response, next: NextFunction): Promise<void>;
    static startTimer(req: Request, res: Response, next: NextFunction): Promise<void>;
    static stopTimer(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getSubtasks(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getDashboard(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getTasksByProject(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getMyTasks(req: Request, res: Response, next: NextFunction): Promise<void>;
    static reportDelay(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=tasks.controller.d.ts.map