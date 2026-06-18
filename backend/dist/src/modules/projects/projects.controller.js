import { ProjectsService } from "./projects.service.js";
import { HttpException } from "../../core/errorHandler.js";
export class ProjectController {
    static async create(req, res, next) {
        try {
            const projectData = req.body;
            const project = await ProjectsService.createProject(projectData);
            res.status(201).json({ status: "success", data: project });
        }
        catch (error) {
            next(error);
        }
    }
    static async delete(req, res, next) {
        try {
            const projectId = req.params.projectId;
            const requestUserId = req.user?.id;
            if (!requestUserId) {
                throw new HttpException("Usuário não autenticado", 401);
            }
            const result = await ProjectsService.deleteProject(projectId, requestUserId);
            res.status(200).json({ status: "success", data: result });
        }
        catch (error) {
            next(error);
        }
    }
    static async getUserProjects(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new HttpException("Usuário não autenticado", 401);
            }
            const projectList = await ProjectsService.getUsersProjects(userId);
            res.status(200).json({ status: "success", data: projectList });
        }
        catch (error) {
            next(error);
        }
    }
}
//# sourceMappingURL=projects.controller.js.map