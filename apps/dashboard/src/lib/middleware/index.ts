import { createMiddleware } from '@tanstack/react-start';
import { dbMiddleware } from './db';
import { sentryMiddleware } from './sentry';

/**
 * Public Middleware Stack
 *
 * Middleware chain for public routes that don't require authentication.
 * Includes:
 * - Sentry error tracking and performance monitoring
 * - Database client injection
 *
 * Use this for routes accessible without login.
 *
 * @example
 * ```ts
 * export const Route = createFileRoute('/api/public/data')({
 *   server: {
 *     middleware: [publicMiddleware],
 *     handlers: {
 *       GET: async ({ context }) => {
 *         // context.db is available
 *         const data = await context.db.query.posts.findMany();
 *         return Response.json(data);
 *       }
 *     }
 *   }
 * });
 * ```
 */
export const publicMiddleware = createMiddleware()
  .middleware([sentryMiddleware, dbMiddleware])
  .server(({ next }) => next());
