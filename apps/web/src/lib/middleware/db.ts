import { createMiddleware } from '@tanstack/react-start';
import { db } from '@xbrk/db/client';
import { sentryMiddleware } from './sentry';

/**
 * Middleware that provides database access to server functions.
 *
 * Injects the database client into the context for use in handlers.
 * Includes Sentry middleware for error tracking.
 *
 * @example
 * ```ts
 * export const $getData = createServerFn({ method: 'GET' })
 *   .middleware([dbMiddleware])
 *   .handler(({ context }) => {
 *     return context.db.query.users.findMany();
 *   });
 * ```
 */
export const dbMiddleware = createMiddleware()
  .middleware([sentryMiddleware])
  .server(({ next }) => {
    return next({ context: { db } });
  });
