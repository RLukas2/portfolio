/**
 * Error handling utilities for Better Auth
 */

/**
 * Handles Better Auth API errors with structured logging
 *
 * @param error - The error object
 * @param ctx - The error context
 */
export function handleAuthError(error: unknown, ctx: unknown): void {
  // Log to console in all environments
  console.error('[Better Auth Error]', {
    error:
      error instanceof Error
        ? {
            message: error.message,
            stack: error.stack,
            name: error.name,
          }
        : error,
    context: ctx,
    timestamp: new Date().toISOString(),
  });

  // In production, you might want to send to error tracking service
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to Sentry
    // Sentry.captureException(error, {
    //   contexts: {
    //     auth: {
    //       context: ctx,
    //     },
    //   },
    // });
  }
}

/**
 * Creates a safe error message for client responses
 * Hides sensitive details in production
 *
 * @param error - The error object
 * @returns Safe error message
 */
export function getSafeErrorMessage(error: unknown): string {
  if (process.env.NODE_ENV === 'development') {
    return error instanceof Error ? error.message : 'An error occurred';
  }

  // In production, return generic message to avoid leaking sensitive info
  return 'Authentication error occurred';
}
