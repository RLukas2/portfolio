import { createMiddleware } from '@tanstack/react-start';
import { getRequest, setResponseStatus } from '@tanstack/react-start/server';
import { ForbiddenError, UnauthorizedError } from '@xbrk/errors';
import { auth } from '@/lib/auth/server';

/**
 * Authentication Middleware
 *
 * Enforces authentication on server functions and API routes.
 * Validates the user session and adds the authenticated user to the request context.
 *
 * If no valid session exists:
 * - Sets HTTP 401 status
 * - Throws an error to halt execution
 *
 * Session caching is disabled to ensure fresh session data on every request,
 * which is important for admin operations.
 *
 * @example
 * ```ts
 * export const Route = createFileRoute('/api/admin/users')({
 *   server: {
 *     middleware: [authMiddleware],
 *     handlers: {
 *       GET: async ({ context }) => {
 *         // context.user is guaranteed to exist here
 *         console.log(context.user.id);
 *       }
 *     }
 *   }
 * });
 * ```
 *
 * @throws {Error} Throws "Unauthorized" if no valid session exists
 * @see {@link https://tanstack.com/start/latest/docs/framework/react/middleware TanStack Middleware Docs}
 * @see {@link https://www.better-auth.com/docs/concepts/session-management Better Auth Session Management}
 */
export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const session = await auth.api.getSession({
    headers: getRequest().headers,
    query: {
      // ensure session is fresh
      // https://www.better-auth.com/docs/concepts/session-management#session-caching
      disableCookieCache: true,
    },
  });

  if (!session) {
    setResponseStatus(401);
    throw new UnauthorizedError();
  }

  return next({ context: { user: session.user } });
});

/**
 * Admin Authorization Middleware
 *
 * Enforces admin role requirement on server functions and API routes.
 * Validates that the authenticated user has admin privileges.
 *
 * IMPORTANT: This middleware MUST be used AFTER authMiddleware in the chain.
 * authMiddleware provides the user context that this middleware validates.
 *
 * If user is not admin:
 * - Sets HTTP 403 status
 * - Throws an error to halt execution
 *
 * @example
 * ```ts
 * export const $deleteProject = createServerFn({ method: 'POST' })
 *   .middleware([sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware])
 *   .handler((ctx) => {
 *     // Only admins can reach here
 *   });
 * ```
 *
 * @throws {Error} Throws "Forbidden: Admin access required" if user is not admin
 * @see {@link https://tanstack.com/start/latest/docs/framework/react/middleware TanStack Middleware Docs}
 */
export const adminMiddleware = createMiddleware().server(({ next, context }) => {
  // Type assertion: context.user should exist from authMiddleware
  const user = (context as unknown as Record<string, unknown>).user as { role?: string } | undefined;

  if (!user) {
    setResponseStatus(401);
    throw new UnauthorizedError('No user in context');
  }

  if (user.role !== 'admin') {
    setResponseStatus(403);
    throw new ForbiddenError('Admin access required');
  }

  return next({ context });
});
