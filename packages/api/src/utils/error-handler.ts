// biome-ignore lint/performance/noNamespaceImport: Sentry SDK requires namespace import
import * as Sentry from '@sentry/node';
import { AppError, InternalServerError } from '@xbrk/errors';
import type { ApiErrorResponse } from '../types/error-response';

// Only non-PII headers safe to forward to Sentry
const SAFE_HEADERS = new Set([
  'content-type',
  'content-length',
  'accept',
  'accept-language',
  'user-agent',
  'x-request-id',
]);

const isDev = process.env.NODE_ENV === 'development';

// Generic message shown to clients for all 5xx in production
const GENERIC_5XX_MESSAGE = 'An unexpected error occurred';

/**
 * Convert any error to AppError, preserving the original for Sentry.
 */
function toAppError(error: unknown): { appError: AppError; originalError: unknown } {
  if (error instanceof AppError) {
    return { appError: error, originalError: error };
  }

  if (error instanceof Error) {
    return {
      appError: new InternalServerError(isDev ? error.message : GENERIC_5XX_MESSAGE),
      originalError: error,
    };
  }

  return {
    appError: new InternalServerError(GENERIC_5XX_MESSAGE),
    originalError: error,
  };
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
  const { appError, originalError } = toAppError(error);
  const is5xx = appError.statusCode >= 500;

  // In production: hide message and metadata for 5xx to avoid leaking internals
  const clientMessage = !isDev && is5xx ? GENERIC_5XX_MESSAGE : appError.message;
  let clientMetadata: Record<string, unknown> | undefined;
  if (isDev || !is5xx) {
    clientMetadata = appError.metadata;
  }

  const response: ApiErrorResponse = {
    error: {
      code: appError.code,
      message: clientMessage,
      statusCode: appError.statusCode,
      timestamp: new Date().toISOString(),
      path: new URL(request.url).pathname,
      requestId: request.headers.get('x-request-id') || undefined,
      metadata: clientMetadata,
    },
  };

  // Log to Sentry for 5xx — send original error to preserve stack trace,
  // whitelist only non-PII headers
  if (is5xx) {
    const safeHeaders: Record<string, string> = {};
    for (const [key, value] of request.headers.entries()) {
      if (SAFE_HEADERS.has(key.toLowerCase())) {
        safeHeaders[key] = value;
      }
    }

    Sentry.captureException(originalError, {
      contexts: {
        request: {
          url: request.url,
          method: request.method,
          headers: safeHeaders,
        },
      },
    });
  }

  if (isDev) {
    console.error('[API Error]', {
      code: appError.code,
      message: appError.message,
      statusCode: appError.statusCode,
      path: response.error.path,
      metadata: appError.metadata,
    });
  }

  // Normalize headers to avoid issues with Headers instance spreading
  const responseHeaders = new Headers({ 'Content-Type': 'application/json' });
  if (headers) {
    const normalized = new Headers(headers);
    for (const [key, value] of normalized.entries()) {
      responseHeaders.set(key, value);
    }
  }

  return new Response(JSON.stringify(response), {
    status: appError.statusCode,
    headers: responseHeaders,
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
  const responseHeaders = new Headers({ 'Content-Type': 'application/json' });
  if (headers) {
    const normalized = new Headers(headers);
    for (const [key, value] of normalized.entries()) {
      responseHeaders.set(key, value);
    }
  }

  return new Response(
    JSON.stringify({
      data,
      ...(metadata && { metadata }),
    }),
    { status, headers: responseHeaders },
  );
}
