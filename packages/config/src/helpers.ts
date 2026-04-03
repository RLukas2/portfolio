import type { AuthProvider, Social } from '@xbrk/types';
import { authProviders } from './auth';
import { socialConfig } from './social';

/**
 * Helper functions for working with configuration
 */

/**
 * Get social profile by name
 * @param name - Social platform name (case-insensitive)
 * @returns Social profile or undefined if not found
 */
export function getSocialByName(name: string): Social | undefined {
  return socialConfig.find((social) => social.name.toLowerCase() === name.toLowerCase());
}

/**
 * Get auth provider by provider ID
 * @param provider - Provider ID (e.g., 'github', 'google')
 * @returns Auth provider or undefined if not found
 */
export function getAuthProviderByName(provider: string): AuthProvider | undefined {
  return authProviders.find((p) => p.provider === provider);
}
