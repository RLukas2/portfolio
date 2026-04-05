import { createFileRoute } from '@tanstack/react-router';
import { auth } from '@/lib/auth/server';

/**
 * Authentication API Route
 *
 * Handles all Better Auth authentication requests including:
 * - Sign in/sign out
 * - OAuth callbacks (GitHub, Google, etc.)
 * - Session management
 * - User registration
 * - Password reset
 *
 * This is a catch-all route that delegates to Better Auth's handler.
 *
 * @see {@link https://www.better-auth.com/docs Better Auth Documentation}
 */
export const Route = createFileRoute('/api/auth/$')({
  server: {
    handlers: {
      GET: ({ request }) => auth.handler(request),
      POST: ({ request }) => auth.handler(request),
    },
  },
});
