// biome-ignore lint/performance/noNamespaceImport: Sentry SDK requires namespace import
import * as Sentry from '@sentry/node';
import { HttpError, InternalServerError } from '@xbrk/errors';
import type { ApiErrorResponse } from './error-response';

const SAFE_HEADERS = new Set([
  'content-type',
  'content-length',
  'accept',
  'accept-language',
  'user-agent',
  'x-request-id',
]);

const isDev = process.env.NODE_ENV === 'development';

const GENERIC_5XX_MESSAGE = 'An unexpected error occurred';

function toAppError(error: unknown): { appError: HttpError; originalError: unknown } {
  if (error instanceof HttpError) {
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

export function handleApiError(error: unknown, request: Request, headers?: HeadersInit): Response {
  const { appError, originalError } = toAppError(error);
  const is5xx = appError.statusCode >= 500;

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
