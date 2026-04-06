import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import { auth } from '@/lib/auth/server';

/**
 * Server function to retrieve the current authenticated user.
 *
 * Fetches the session from the request headers and returns the user object if authenticated.
 *
 * @returns The authenticated user object or null if not authenticated
 */
export const $getUser = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await auth.api.getSession({
    headers: getRequest().headers,
  });

  return session?.user || null;
});
