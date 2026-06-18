export class HttpException extends Error {
    statusCode;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
export class NotFoundException extends HttpException {
    constructor(message = "Not found") {
        super(message, 404);
    }
}
//# sourceMappingURL=errorHandler.js.map