import type { NextFunction, Request, Response } from "express";
import { HttpException } from "../core/errorHandler.js";

function errorMiddleware(
  error: HttpException,
  request: Request,
  response: Response,
  next: NextFunction,
) {
  if (error instanceof HttpException) {
    return response.status(error.statusCode).json({ message: error.message });
  }
  console.error("Erro inesperado:", error);
  return response.status(500).json({ message: "Internal server error" });
}

export default errorMiddleware;
