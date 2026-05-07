export class HttpException extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class NotFoundException extends HttpException {
  constructor(message: string = "Not found") {
    super(message, 404);
  }
}
