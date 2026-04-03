/**
 * @xbrk/config
 * Centralized configuration for the application
 */

export type { AuthProvider, SiteConfig, Social } from '@xbrk/types';
export { authProviders } from './auth';
export { getAuthProviderByName, getSocialByName } from './helpers';
export { siteConfig } from './site';
export { socialConfig } from './social';
export {
  validateAuthProviders,
  validateSiteConfig,
  validateSocialConfig,
} from './validation';
