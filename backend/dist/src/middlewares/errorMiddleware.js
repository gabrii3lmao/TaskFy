import { HttpException } from "../core/errorHandler.js";
function errorMiddleware(error, request, response, next) {
    if (error instanceof HttpException) {
        return response.status(error.statusCode).json({ message: error.message });
    }
    console.error("Erro inesperado:", error);
    return response.status(500).json({ message: "Internal server error" });
}
export default errorMiddleware;
//# sourceMappingURL=errorMiddleware.js.map