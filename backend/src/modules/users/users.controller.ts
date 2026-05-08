import { UsersService } from "./users.service.js";
import type { Request, Response, NextFunction } from "express";

export class UsersController {
  static async searchUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const searchQuery = req.query.q as string;
      if (!searchQuery) {
        return res.json({ status: "sucess", data: [] });
      }

      const usersList = await UsersService.searchUsers(searchQuery);
      return res.json({ status: "sucess", data: usersList });
    } catch (error) {
      next(error);
    }
  }
}
