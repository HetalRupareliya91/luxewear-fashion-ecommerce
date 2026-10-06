/** An error that carries the HTTP status it should be reported with. */
export class AppError extends Error {
  readonly statusCode: number;
  readonly details?: unknown;

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.details = details;
  }

  static badRequest(message = "Bad request", details?: unknown) {
    return new AppError(400, message, details);
  }
  static unauthorized(message = "Authentication required") {
    return new AppError(401, message);
  }
  static forbidden(message = "You do not have access to this resource") {
    return new AppError(403, message);
  }
  static notFound(message = "Resource not found") {
    return new AppError(404, message);
  }
  static conflict(message = "Conflict", details?: unknown) {
    return new AppError(409, message, details);
  }
}
