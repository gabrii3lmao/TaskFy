import { UsersService } from "./users.service.js";
import { WorkloadService } from "./users.workload.service.js";
import { HttpException } from "../../core/errorHandler.js";
export class UsersController {
    static async searchUsers(req, res, next) {
        try {
            const searchQuery = req.query.q;
            if (!searchQuery) {
                return res.json({ status: "sucess", data: [] });
            }
            const usersList = await UsersService.searchUsers(searchQuery);
            return res.json({ status: "sucess", data: usersList });
        }
        catch (error) {
            next(error);
        }
    }
    static async getUsersWorkloadBalance(req, res, next) {
        try {
            const { teamId } = req.query;
            if (!teamId) {
                throw new HttpException("O ID da equipe é obrigatório para calcular a carga de trabalho.", 400);
            }
            const workloadBalance = await WorkloadService.getWorkloadBalance(teamId);
            return res.status(200).json({ status: "success", data: workloadBalance });
        }
        catch (error) {
            next(error);
        }
    }
}
//# sourceMappingURL=users.controller.js.map