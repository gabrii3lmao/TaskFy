import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { validate } from "../../middlewares/validationMiddleware.js";
import { registerSchema, loginSchema, refreshSchema } from "./auth.schema.js";
const authRouter = Router();
authRouter.post("/register", validate(registerSchema), AuthController.register);
authRouter.post("/login", validate(loginSchema), AuthController.login);
authRouter.post("/refresh", validate(refreshSchema), AuthController.refresh);
authRouter.post("/logout", validate(refreshSchema), AuthController.logout);
export default authRouter;
//# sourceMappingURL=auth.routes.js.map