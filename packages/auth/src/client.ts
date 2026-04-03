/**
 * Client-side auth utilities for Better Auth.
 *
 * This module provides client-side utilities for authentication,
 * including hooks and helper functions for React applications.
 */

import { createAuthClient } from 'better-auth/client';
import { adminClient } from 'better-auth/client/plugins';

/**
 * Creates a Better Auth client instance for client-side usage.
 *
 * @param baseURL - The base URL of your auth API (e.g., 'http://localhost:3000')
 * @returns Auth client instance
 *
 * @example
 * ```typescript
 * import { createClient } from '@xbrk/auth/client';
 *
 * export const authClient = createClient('http://localhost:3000');
 *
 * // Sign in
 * await authClient.signIn.email({
 *   email: 'user@example.com',
 *   password: 'password123',
 * });
 *
 * // Get session
 * const session = await authClient.getSession();
 *
 * // Sign out
 * await authClient.signOut();
 * ```
 */
export function createClient(baseURL: string) {
  return createAuthClient({
    baseURL,
    plugins: [adminClient()],
  });
}

/**
 * Type for the auth client instance.
 */
export type AuthClient = ReturnType<typeof createClient>;

/**
 * Helper to check if user is authenticated on the client.
 *
 * @param client - The auth client instance
 * @returns Promise resolving to true if authenticated
 *
 * @example
 * ```typescript
 * import { isAuthenticated } from '@xbrk/auth/client';
 * import { authClient } from './auth-client';
 *
 * if (await isAuthenticated(authClient)) {
 *   console.log('User is logged in');
 * }
 * ```
 */
export async function isAuthenticated(client: AuthClient): Promise<boolean> {
  try {
    const session = await client.getSession();
    return session.data !== null;
  } catch {
    return false;
  }
}

/**
 * Helper to check if user is admin on the client.
 *
 * @param client - The auth client instance
 * @returns Promise resolving to true if user is admin
 *
 * @example
 * ```typescript
 * import { isAdmin } from '@xbrk/auth/client';
 * import { authClient } from './auth-client';
 *
 * if (await isAdmin(authClient)) {
 *   console.log('User is admin');
 * }
 * ```
 */
export async function isAdmin(client: AuthClient): Promise<boolean> {
  try {
    const session = await client.getSession();
    return session.data?.user?.role === 'admin';
  } catch {
    return false;
  }
}

/**
 * Helper to get current user from session.
 *
 * @param client - The auth client instance
 * @returns Promise resolving to user object or null
 *
 * @example
 * ```typescript
 * import { getCurrentUser } from '@xbrk/auth/client';
 * import { authClient } from './auth-client';
 *
 * const user = await getCurrentUser(authClient);
 * if (user) {
 *   console.log('Welcome,', user.name);
 * }
 * ```
 */
export async function getCurrentUser(client: AuthClient) {
  try {
    const session = await client.getSession();
    return session.data?.user ?? null;
  } catch {
    return null;
  }
}

/**
 * Helper to sign in with email and password.
 *
 * @param client - The auth client instance
 * @param email - User email
 * @param password - User password
 * @returns Promise resolving to session data
 *
 * @example
 * ```typescript
 * import { signInWithEmail } from '@xbrk/auth/client';
 * import { authClient } from './auth-client';
 *
 * try {
 *   await signInWithEmail(authClient, 'user@example.com', 'password123');
 *   console.log('Signed in successfully');
 * } catch (error) {
 *   console.error('Sign in failed:', error);
 * }
 * ```
 */
export function signInWithEmail(client: AuthClient, email: string, password: string) {
  return client.signIn.email({
    email,
    password,
  });
}

/**
 * Helper to sign up with email and password.
 *
 * @param client - The auth client instance
 * @param email - User email
 * @param password - User password
 * @param name - User name
 * @returns Promise resolving to user data
 *
 * @example
 * ```typescript
 * import { signUpWithEmail } from '@xbrk/auth/client';
 * import { authClient } from './auth-client';
 *
 * try {
 *   await signUpWithEmail(authClient, 'user@example.com', 'password123', 'John Doe');
 *   console.log('Signed up successfully');
 * } catch (error) {
 *   console.error('Sign up failed:', error);
 * }
 * ```
 */
export function signUpWithEmail(client: AuthClient, email: string, password: string, name: string) {
  return client.signUp.email({
    email,
    password,
    name,
  });
}

/**
 * Helper to sign out the current user.
 *
 * @param client - The auth client instance
 * @returns Promise resolving when sign out is complete
 *
 * @example
 * ```typescript
 * import { signOut } from '@xbrk/auth/client';
 * import { authClient } from './auth-client';
 *
 * await signOut(authClient);
 * console.log('Signed out successfully');
 * ```
 */
export function signOut(client: AuthClient) {
  return client.signOut();
}
