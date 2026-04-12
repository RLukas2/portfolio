// biome-ignore lint/performance/noNamespaceImport: Sentry SDK requires namespace import
import * as Sentry from '@sentry/node';
import { AppError, InternalServerError } from '@xbrk/errors';
import type { ApiErrorResponse } from '../types/error-response';

/**
 * Convert any error to AppError
 */
function toAppError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new InternalServerError(error.message);
  }

  return new InternalServerError('An unexpected error occurred');
}

/**
 * Standard error handler for API routes
 * Converts errors to consistent API error responses
 *
 * @example
 * ```typescript
 * export async function POST(request: Request) {
 *   try {
 *     // ... your logic
 *   } catch (error) {
 *     return handleApiError(error, request);
 *   }
 * }
 * ```
 */
export function handleApiError(error: unknown, request: Request, headers?: HeadersInit): Response {
  const appError = toAppError(error);

  // Create standard error response
  const response: ApiErrorResponse = {
    error: {
      code: appError.code,
      message: appError.message,
      statusCode: appError.statusCode,
      timestamp: new Date().toISOString(),
      path: new URL(request.url).pathname,
      requestId: request.headers.get('x-request-id') || undefined,
      metadata: appError.metadata,
    },
  };

  // Log to Sentry for server errors (5xx)
  if (appError.statusCode >= 500) {
    Sentry.captureException(appError, {
      contexts: {
        request: {
          url: request.url,
          method: request.method,
          headers: Object.fromEntries(request.headers.entries()),
        },
      },
    });
  }

  // Log to console for debugging
  if (process.env.NODE_ENV === 'development') {
    console.error('[API Error]', {
      code: appError.code,
      message: appError.message,
      statusCode: appError.statusCode,
      path: response.error.path,
      metadata: appError.metadata,
    });
  }

  return new Response(JSON.stringify(response), {
    status: appError.statusCode,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
}

/**
 * Create a success response
 *
 * @example
 * ```typescript
 * return createSuccessResponse({ id: 1, title: 'Hello' });
 *
 * // With custom headers
 * return createSuccessResponse(
 *   { content, toc },
 *   undefined,
 *   200,
 *   { 'Cache-Control': 'public, max-age=3600' }
 * );
 * ```
 */
export function createSuccessResponse<T>(
  data: T,
  metadata?: Record<string, unknown>,
  status = 200,
  headers?: HeadersInit,
): Response {
  return new Response(
    JSON.stringify({
      data,
      ...(metadata && { metadata }),
    }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    },
  );
}
