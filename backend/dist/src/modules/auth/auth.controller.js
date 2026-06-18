import { AuthService } from "./auth.service.js";
export class AuthController {
    static async register(req, res, next) {
        try {
            const { name, email, password } = req.body;
            const user = await AuthService.register(name, email, password);
            res.status(201).json({ status: "success", data: user });
        }
        catch (error) {
            next(error);
        }
    }
    static async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const data = await AuthService.login(email, password);
            res.status(200).json({ status: "success", data });
        }
        catch (error) {
            next(error);
        }
    }
}
//# sourceMappingURL=auth.controller.js.map