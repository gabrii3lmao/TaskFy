export declare class HttpException extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number);
}
export declare class NotFoundException extends HttpException {
    constructor(message?: string);
}
//# sourceMappingURL=errorHandler.d.ts.map