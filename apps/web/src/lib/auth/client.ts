import { adminClient, inferAdditionalFields } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { getBaseUrl } from '@/lib/utils';
import type { auth } from './server';

/**
 * Better Auth client instance for authentication operations.
 *
 * Configured with admin client plugin and additional field inference.
 * Use this client for all authentication-related operations on the client side.
 *
 * @example
 * ```tsx
 * import authClient from '@/lib/auth/client';
 *
 * // Sign in
 * await authClient.signIn.email({ email, password });
 *
 * // Sign out
 * await authClient.signOut();
 * ```
 */
const authClient = createAuthClient({
  baseURL: getBaseUrl(),
  plugins: [adminClient(), inferAdditionalFields<typeof auth>()],
});

export default authClient;
