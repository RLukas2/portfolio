/**
 * Social provider configuration builder
 */

import type { InitAuthOptions } from './validation';

/**
 * Builds social provider configuration from options.
 * Only includes providers that have both client ID and secret configured.
 *
 * @param options - Auth initialization options
 * @param productionUrl - Production URL for OAuth callbacks
 * @returns Social providers configuration object
 */
export function buildSocialProviders(options: InitAuthOptions, productionUrl: string) {
  const providers: Record<string, unknown> = {};

  // GitHub
  if (options.githubClientId && options.githubClientSecret) {
    providers.github = {
      clientId: options.githubClientId,
      clientSecret: options.githubClientSecret,
      redirectURI: `${productionUrl}/api/auth/callback/github`,
    };
  }

  // Twitter
  if (options.twitterClientId && options.twitterClientSecret) {
    providers.twitter = {
      clientId: options.twitterClientId,
      clientSecret: options.twitterClientSecret,
      redirectURI: `${productionUrl}/api/auth/callback/twitter`,
    };
  }

  // Google
  if (options.googleClientId && options.googleClientSecret) {
    providers.google = {
      clientId: options.googleClientId,
      clientSecret: options.googleClientSecret,
      prompt: 'select_account consent' as const,
      redirectURI: `${productionUrl}/api/auth/callback/google`,
    };
  }

  // Facebook
  if (options.facebookClientId && options.facebookClientSecret) {
    providers.facebook = {
      clientId: options.facebookClientId,
      clientSecret: options.facebookClientSecret,
      redirectURI: `${productionUrl}/api/auth/callback/facebook`,
    };
  }

  return providers;
}

/**
 * Gets a list of enabled social provider names
 *
 * @param options - Auth initialization options
 * @returns Array of enabled provider names
 */
export function getEnabledProviders(options: InitAuthOptions): string[] {
  const enabled: string[] = [];

  if (options.githubClientId && options.githubClientSecret) {
    enabled.push('github');
  }
  if (options.twitterClientId && options.twitterClientSecret) {
    enabled.push('twitter');
  }
  if (options.googleClientId && options.googleClientSecret) {
    enabled.push('google');
  }
  if (options.facebookClientId && options.facebookClientSecret) {
    enabled.push('facebook');
  }

  return enabled;
}
