import { createMiddleware } from '@tanstack/react-start';
import { adminMiddleware, authMiddleware } from '@/lib/auth/middleware';
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

/**
 * Protected Middleware Stack
 *
 * Middleware chain for protected routes requiring authentication.
 * Includes:
 * - Sentry error tracking and performance monitoring
 * - Database client injection
 * - Authentication validation
 *
 * Use this for admin-only routes. Automatically returns 401 if not authenticated.
 *
 * @example
 * ```ts
 * export const Route = createFileRoute('/api/admin/users')({
 *   server: {
 *     middleware: [protectedMiddleware],
 *     handlers: {
 *       GET: async ({ context }) => {
 *         // context.db and context.user are available
 *         console.log('Admin user:', context.user.email);
 *         const users = await context.db.query.users.findMany();
 *         return Response.json(users);
 *       }
 *     }
 *   }
 * });
 * ```
 */
export const protectedMiddleware = createMiddleware()
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware])
  .server(({ next }) => next());
