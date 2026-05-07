import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { HttpException } from "../core/errorHandler.js";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (authHeader || !authHeader?.startsWith("Bearer")) {
    return next(new HttpException("Token não fornecido", 401));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token as string, process.env.JWT_SECRET!);
    req.user = { id: (decoded as JwtPayload).userId };
    next();
  } catch (error) {
    return next(new HttpException("Token inválido ou expirado", 401));
  }
};
