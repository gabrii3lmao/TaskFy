import type { Request, Response, NextFunction } from "express";
import { ProjectsService } from "./projects.service.js";

export class ProjectController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const projectData = req.body;

      const project = await ProjectsService.createProject(projectData);
      res.status(201).json({ status: "success", data: project });
    } catch (error) {
      next(error);
    }
  }
}
