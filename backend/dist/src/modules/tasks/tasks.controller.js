import { TasksService } from "./tasks.service.js";
import { TasksDashboardService } from "./tasks.dashboard.service.js";
import { HttpException } from "../../core/errorHandler.js";
export class TasksController {
    static async create(req, res, next) {
        try {
            const taskData = req.body;
            const task = await TasksService.createTask(taskData);
            res.status(201).json({ status: "success", data: task });
        }
        catch (error) {
            next(error);
        }
    }
    static async update(req, res, next) {
        try {
            const { taskId } = req.params;
            const userId = req.user?.id;
            const updateData = req.body;
            if (!userId) {
                throw new HttpException("Usuário não autenticado", 401);
            }
            const task = await TasksService.updateTask(taskId, updateData, userId);
            res.status(200).json({ status: "success", data: task });
        }
        catch (error) {
            next(error);
        }
    }
    static async delete(req, res, next) {
        try {
            const { taskId } = req.params;
            const userId = req.user?.id;
            if (!userId) {
                throw new HttpException("Usuário não autenticado", 401);
            }
            const result = await TasksService.deleteTask(taskId, userId);
            res.status(200).json({ status: "success", data: result });
        }
        catch (error) {
            next(error);
        }
    }
    static async complete(req, res, next) {
        try {
            const { taskId } = req.params;
            const userId = req.user?.id;
            if (!userId) {
                throw new HttpException("Usuário não autenticado", 401);
            }
            const task = await TasksService.completeTask(taskId, userId);
            res.status(200).json({ status: "success", data: task });
        }
        catch (error) {
            next(error);
        }
    }
    static async startTimer(req, res, next) {
        try {
            const { taskId } = req.params;
            const userId = req.user?.id;
            if (!userId) {
                throw new HttpException("Usuário não autenticado", 401);
            }
            const result = await TasksService.startTaskTimer(taskId, userId);
            res.status(200).json({ status: "success", data: result });
        }
        catch (error) {
            next(error);
        }
    }
    static async stopTimer(req, res, next) {
        try {
            const { taskId } = req.params;
            const userId = req.user?.id;
            if (!userId) {
                throw new HttpException("Usuário não autenticado", 401);
            }
            const result = await TasksService.stopTaskTimer(taskId, userId);
            res.status(200).json({ status: "success", data: result });
        }
        catch (error) {
            next(error);
        }
    }
    static async getSubtasks(req, res, next) {
        try {
            const { taskId } = req.params;
            const subtasks = await TasksService.getSubtasks(taskId);
            res.status(200).json({ status: "success", data: subtasks });
        }
        catch (error) {
            next(error);
        }
    }
    static async getDashboard(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new HttpException("Usuário não autenticado", 401);
            }
            const dashboardData = await TasksDashboardService.getUserDashboard(userId);
            res.status(200).json({ status: "success", data: dashboardData });
        }
        catch (error) {
            next(error);
        }
    }
    static async getTasksByProject(req, res, next) {
        try {
            const { projectId } = req.query;
            if (!projectId) {
                throw new HttpException("Projeto não encontrado", 404);
            }
            const tasks = await TasksService.getTasksByProject(projectId);
            res.status(200).json({ status: "success", data: tasks });
        }
        catch (error) {
            next(error);
        }
    }
    static async getMyTasks(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new HttpException("Usuário não autenticado", 401);
            }
            const tasks = await TasksDashboardService.getUserTasks(userId);
            res.status(200).json({ status: "success", data: tasks });
        }
        catch (error) {
            next(error);
        }
    }
    static async reportDelay(req, res, next) {
        try {
            const { taskId } = req.params;
            const userId = req.user?.id;
            const { reason } = req.body;
            if (!userId) {
                throw new HttpException("Usuário não autenticado", 401);
            }
            const result = await TasksService.reportDelay(taskId, userId, reason);
            res.status(200).json({ status: "success", data: result });
        }
        catch (error) {
            next(error);
        }
    }
}
//# sourceMappingURL=tasks.controller.js.map