import type { NextFunction, Request, Response } from "express";
import { HttpException } from "../core/errorHandler.js";
declare function errorMiddleware(error: HttpException, request: Request, response: Response, next: NextFunction): Response<any, Record<string, any>>;
export default errorMiddleware;
//# sourceMappingURL=errorMiddleware.d.ts.map