import { type ErrorCode, ErrorCodes } from './codes';

export interface HttpErrorOptions {
  cause?: Error;
  metadata?: Record<string, unknown>;
}

export class HttpError extends Error {
  readonly code: ErrorCode;
  readonly statusCode: number;
  readonly metadata?: Record<string, unknown>;

  constructor(message: string, code: ErrorCode, statusCode: number, options?: HttpErrorOptions) {
    super(message, { cause: options?.cause });
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.metadata = options?.metadata;

    // biome-ignore lint/complexity/noBannedTypes: Error.captureStackTrace requires Function type
    if (typeof (Error as unknown as { captureStackTrace?: unknown }).captureStackTrace === 'function') {
      // biome-ignore lint/complexity/noBannedTypes: Error.captureStackTrace requires Function type
      (Error as unknown as { captureStackTrace: (target: object, constructorOpt: Function) => void }).captureStackTrace(
        this,
        this.constructor,
      );
    }
  }

  toJSON(includeStack?: boolean): Record<string, unknown> {
    const json: Record<string, unknown> = {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      metadata: this.metadata,
    };
    if (includeStack && this.stack) {
      json.stack = this.stack;
    }
    return json;
  }
}

export class ValidationError extends HttpError {
  constructor(message: string, options?: HttpErrorOptions) {
    super(message, ErrorCodes.VALIDATION, 400, options);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message?: string, options?: HttpErrorOptions) {
    super(message ?? 'Unauthorized', ErrorCodes.UNAUTHORIZED, 401, options);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message?: string, options?: HttpErrorOptions) {
    super(message ?? 'Forbidden', ErrorCodes.FORBIDDEN, 403, options);
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string, options?: HttpErrorOptions) {
    super(message, ErrorCodes.NOT_FOUND, 404, options);
  }

  static forResource(resource: string, options?: HttpErrorOptions): NotFoundError {
    return new NotFoundError(`${resource} not found`, {
      ...options,
      metadata: { ...options?.metadata, resource },
    });
  }
}

export class ConflictError extends HttpError {
  constructor(message: string, options?: HttpErrorOptions) {
    super(message, ErrorCodes.CONFLICT, 409, options);
  }
}

export class RateLimitError extends HttpError {
  constructor(message?: string, options?: HttpErrorOptions) {
    super(message ?? 'Too many requests', ErrorCodes.RATE_LIMIT, 429, options);
  }
}

export class InternalServerError extends HttpError {
  constructor(message?: string, options?: HttpErrorOptions) {
    super(message ?? 'Internal server error', ErrorCodes.INTERNAL, 500, options);
  }
}

export class ServiceUnavailableError extends HttpError {
  constructor(message?: string, options?: HttpErrorOptions) {
    super(message ?? 'Service temporarily unavailable', ErrorCodes.SERVICE_UNAVAILABLE, 503, options);
  }
}
