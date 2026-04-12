/**
 * Base Application Error
 * All custom errors should extend this class
 */
export class AppError extends Error {
  code: string;
  statusCode: number;
  metadata?: Record<string, unknown>;

  constructor(message: string, code: string, statusCode: number, metadata?: Record<string, unknown>) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.metadata = metadata;

    // Only use captureStackTrace if available (V8 only, not on edge runtime)
    if (typeof (Error as unknown as { captureStackTrace?: unknown }).captureStackTrace === 'function') {
      // biome-ignore lint/complexity/noBannedTypes: Error.captureStackTrace requires Function type
      (Error as unknown as { captureStackTrace: (target: object, constructorOpt: Function) => void }).captureStackTrace(
        this,
        this.constructor,
      );
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      metadata: this.metadata,
    };
  }
}

/**
 * 400 - Bad Request / Validation Error
 * Use when user input is invalid
 */
export class ValidationError extends AppError {
  constructor(message: string, metadata?: Record<string, unknown>) {
    super(message, 'VALIDATION_ERROR', 400, metadata);
  }
}

/**
 * 401 - Unauthorized
 * Use when user is not authenticated
 */
export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 'UNAUTHORIZED', 401);
  }
}

/**
 * 403 - Forbidden
 * Use when user is authenticated but doesn't have permission
 */
export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 'FORBIDDEN', 403);
  }
}

/**
 * 404 - Not Found
 * Use when requested resource doesn't exist
 */
export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 'NOT_FOUND', 404, { resource });
  }
}

/**
 * 409 - Conflict
 * Use when there's a conflict (e.g., duplicate entry)
 */
export class ConflictError extends AppError {
  constructor(message: string, metadata?: Record<string, unknown>) {
    super(message, 'CONFLICT', 409, metadata);
  }
}

/**
 * 429 - Too Many Requests
 * Use when rate limit is exceeded
 */
export class RateLimitError extends AppError {
  constructor(message = 'Too many requests') {
    super(message, 'RATE_LIMIT_EXCEEDED', 429);
  }
}

/**
 * 500 - Internal Server Error
 * Use for unexpected server errors
 */
export class InternalServerError extends AppError {
  constructor(message = 'Internal server error') {
    super(message, 'INTERNAL_SERVER_ERROR', 500);
  }
}

/**
 * 503 - Service Unavailable
 * Use when service is temporarily unavailable
 */
export class ServiceUnavailableError extends AppError {
  constructor(message = 'Service temporarily unavailable') {
    super(message, 'SERVICE_UNAVAILABLE', 503);
  }
}
