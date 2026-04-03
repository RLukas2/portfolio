/**
 * Auth middleware utilities for route protection and session management.
 *
 * This module provides middleware functions for protecting routes and
 * validating user sessions in your application.
 */

import type { Auth, Session } from './index';

/**
 * Creates a middleware function that requires authentication.
 * Redirects to login page if user is not authenticated.
 *
 * @param auth - The Better Auth instance
 * @param redirectTo - URL to redirect to if not authenticated (default: '/login')
 * @returns Middleware function
 *
 * @example
 * ```typescript
 * import { requireAuth } from '@xbrk/auth/middleware';
 * import { auth } from './auth';
 *
 * export const middleware = requireAuth(auth);
 * ```
 */
export function requireAuth(auth: Auth, redirectTo = '/login') {
  return async (request: Request) => {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return Response.redirect(new URL(redirectTo, request.url));
    }

    return null; // Continue to route
  };
}

/**
 * Creates a middleware function that requires admin role.
 * Returns 403 Forbidden if user is not an admin.
 *
 * @param auth - The Better Auth instance
 * @returns Middleware function
 *
 * @example
 * ```typescript
 * import { requireAdmin } from '@xbrk/auth/middleware';
 * import { auth } from './auth';
 *
 * export const adminMiddleware = requireAdmin(auth);
 * ```
 */
export function requireAdmin(auth: Auth) {
  return async (request: Request) => {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }

    if (session.user.role !== 'admin') {
      return new Response('Forbidden', { status: 403 });
    }

    return null; // Continue to route
  };
}

/**
 * Creates a middleware function that requires a specific role.
 * Returns 403 Forbidden if user doesn't have the required role.
 *
 * @param auth - The Better Auth instance
 * @param requiredRole - The role required to access the route
 * @returns Middleware function
 *
 * @example
 * ```typescript
 * import { requireRole } from '@xbrk/auth/middleware';
 * import { auth } from './auth';
 *
 * export const editorMiddleware = requireRole(auth, 'editor');
 * ```
 */
export function requireRole(auth: Auth, requiredRole: string) {
  return async (request: Request) => {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }

    if (session.user.role !== requiredRole) {
      return new Response('Forbidden', { status: 403 });
    }

    return null; // Continue to route
  };
}

/**
 * Gets the current session from request headers.
 * Returns null if no session exists.
 *
 * @param auth - The Better Auth instance
 * @param request - The incoming request
 * @returns Session object or null
 *
 * @example
 * ```typescript
 * import { getSession } from '@xbrk/auth/middleware';
 * import { auth } from './auth';
 *
 * const session = await getSession(auth, request);
 * if (session) {
 *   console.log('User:', session.user.name);
 * }
 * ```
 */
export async function getSession(auth: Auth, request: Request): Promise<Session | null> {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    return session;
  } catch (error) {
    console.error('Failed to get session:', error);
    return null;
  }
}

/**
 * Checks if the current user is authenticated.
 *
 * @param auth - The Better Auth instance
 * @param request - The incoming request
 * @returns True if authenticated, false otherwise
 *
 * @example
 * ```typescript
 * import { isAuthenticated } from '@xbrk/auth/middleware';
 * import { auth } from './auth';
 *
 * if (await isAuthenticated(auth, request)) {
 *   // User is logged in
 * }
 * ```
 */
export async function isAuthenticated(auth: Auth, request: Request): Promise<boolean> {
  const session = await getSession(auth, request);
  return session !== null;
}

/**
 * Checks if the current user has admin role.
 *
 * @param auth - The Better Auth instance
 * @param request - The incoming request
 * @returns True if user is admin, false otherwise
 *
 * @example
 * ```typescript
 * import { isAdmin } from '@xbrk/auth/middleware';
 * import { auth } from './auth';
 *
 * if (await isAdmin(auth, request)) {
 *   // User is admin
 * }
 * ```
 */
export async function isAdmin(auth: Auth, request: Request): Promise<boolean> {
  const session = await getSession(auth, request);
  return session?.user.role === 'admin';
}
