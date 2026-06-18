import { initAuth } from '@xbrk/auth';
import { env } from '@/lib/env/server';
import { getBaseUrl } from '@/lib/utils';

/**
 * Better Auth Server Configuration
 *
 * Initializes the authentication system with OAuth providers and session management.
 * This is the server-side auth instance used for session validation and user management.
 *
 * Supported OAuth providers:
 * - GitHub
 * - Twitter
 * - Google
 * - Facebook
 *
 * Configuration is loaded from environment variables defined in env/server.ts
 *
 * The `productionUrl` is the canonical URL registered with OAuth providers.
 * The `baseUrl` is the runtime URL (may differ in preview deployments).
 *
 * @see {@link https://www.better-auth.com/docs Better Auth Documentation}
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
