export function handleAuthError(error: unknown, ctx: unknown): void {
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

export function getSafeErrorMessage(error: unknown): string {
  if (process.env.NODE_ENV === 'development') {
    return error instanceof Error ? error.message : 'An error occurred';
  }

  return 'Authentication error occurred';
}
