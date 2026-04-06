import { initAuth } from '@xbrk/auth';
import { env } from '@/lib/env/server';
import { getBaseUrl } from '@/lib/utils';

/**
 * Better Auth server instance for authentication operations.
 *
 * Configured with OAuth providers (GitHub, Twitter, Google, Facebook)
 * and environment-specific URLs.
 *
 * The `productionUrl` is the canonical URL registered with OAuth providers.
 * The `baseUrl` is the runtime URL (may differ in preview deployments).
 *
 * @example
 * ```ts
 * import { auth } from '@/lib/auth/server';
 *
 * // Get session
 * const session = await auth.api.getSession({ headers });
 * ```
 */
const productionUrl = env.VITE_APP_URL ?? getBaseUrl();

export const auth = initAuth({
  baseUrl: getBaseUrl(),
  productionUrl,

  secret: env.BETTER_AUTH_SECRET,
  githubClientId: env.GITHUB_CLIENT_ID,
  githubClientSecret: env.GITHUB_CLIENT_SECRET,
  twitterClientId: env.TWITTER_CLIENT_ID,
  twitterClientSecret: env.TWITTER_CLIENT_SECRET,
  googleClientId: env.GOOGLE_CLIENT_ID,
  googleClientSecret: env.GOOGLE_CLIENT_SECRET,
  facebookClientId: env.FACEBOOK_CLIENT_ID,
  facebookClientSecret: env.FACEBOOK_CLIENT_SECRET,
});
