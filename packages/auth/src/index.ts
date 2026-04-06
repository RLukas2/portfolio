import { db } from '@xbrk/db/client';
import type { BetterAuthOptions } from 'better-auth';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin, oAuthProxy } from 'better-auth/plugins';
import { tanstackStartCookies } from 'better-auth/tanstack-start';
import { handleAuthError } from './lib/error-handler';
import { buildSocialProviders, getEnabledProviders } from './lib/providers';
import type { InitAuthOptions } from './lib/validation';
import { validateAuthOptions } from './lib/validation';

/**
 * Initializes a Better Auth instance with Drizzle adapter and optional social providers.
 *
 * Social providers (GitHub, Twitter, Google, Facebook) are only registered when
 * their respective client ID and secret are provided — omitting them disables that provider
 * without throwing an error.
 *
 * Includes the `admin` plugin for user management and `oAuthProxy` for redirect handling
 * in non-production environments.
 *
 * @param options - Configuration options for Better Auth
 * @returns Configured Better Auth instance
 * @throws {Error} If options validation fails
 *
 * @example
 * ```typescript
 * import { initAuth } from '@xbrk/auth';
 *
 * export const auth = initAuth({
 *   baseUrl: 'http://localhost:3000',
 *   productionUrl: 'https://example.com',
 *   secret: process.env.BETTER_AUTH_SECRET,
 *   githubClientId: process.env.GITHUB_CLIENT_ID,
 *   githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
 * });
 * ```
 */
export function initAuth(options: InitAuthOptions) {
  // Validate options
  const validatedOptions = validateAuthOptions(options);

  // Build social providers configuration
  const socialProviders = buildSocialProviders(validatedOptions, validatedOptions.productionUrl);

  // Log enabled providers in development
  if (process.env.NODE_ENV === 'development') {
    const enabledProviders = getEnabledProviders(validatedOptions);
    console.log(
      '[Better Auth] Enabled social providers:',
      enabledProviders.length > 0 ? enabledProviders.join(', ') : 'none',
    );
  }

  const config = {
    database: drizzleAdapter(db, {
      provider: 'pg',
    }),
    baseURL: validatedOptions.baseUrl,
    secret: validatedOptions.secret,
    telemetry: {
      enabled: false,
    },
    plugins: [
      oAuthProxy({
        productionURL: validatedOptions.productionUrl,
      }),
      admin(),
      tanstackStartCookies(),
    ],
    socialProviders,
    onAPIError: {
      onError: handleAuthError,
      errorURL: '/signin',
    },
    user: {
      deleteUser: {
        enabled: true,
      },
      additionalFields: {
        twitterHandle: {
          type: 'string' as const,
          required: false,
        },
      },
    },
  } satisfies BetterAuthOptions;

  return betterAuth(config);
}

export type Auth = ReturnType<typeof initAuth>;
export type Session = Auth['$Infer']['Session'];

export { getSafeErrorMessage, handleAuthError } from './lib/error-handler';
export { buildSocialProviders, getEnabledProviders } from './lib/providers';
export type { InitAuthOptions } from './lib/validation';
// Re-export utilities
export { validateAuthOptions } from './lib/validation';
