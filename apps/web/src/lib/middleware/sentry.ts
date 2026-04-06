// biome-ignore lint/performance/noNamespaceImport: Sentry SDK requires namespace import
import * as Sentry from '@sentry/tanstackstart-react';
import { createMiddleware } from '@tanstack/react-start';

/**
 * Middleware that wraps server functions with Sentry error tracking.
 *
 * Creates a Sentry span for each server function execution and
 * automatically captures any thrown exceptions.
 *
 * @example
 * ```ts
 * export const $getData = createServerFn({ method: 'GET' })
 *   .middleware([sentryMiddleware])
 *   .handler(async () => {
 *     // Errors here are automatically captured by Sentry
 *     return await fetchData();
 *   });
 * ```
 */
export const sentryMiddleware = createMiddleware().server(({ next }) => {
  return Sentry.startSpan({ name: 'server-function', op: 'function' }, async () => {
    try {
      return await next();
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  });
});
