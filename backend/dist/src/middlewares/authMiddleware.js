import jwt, {} from "jsonwebtoken";
import { HttpException } from "../core/errorHandler.js";
export const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader?.startsWith("Bearer")) {
        return next(new HttpException("Token não fornecido", 401));
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.userId };
        next();
    }
    catch (error) {
        return next(new HttpException("Token inválido ou expirado", 401));
    }
};
//# sourceMappingURL=authMiddleware.js.map