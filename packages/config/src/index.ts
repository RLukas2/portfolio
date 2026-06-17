/**
 * @xbrk/config
 * Centralized configuration for the application
 */

export { authProviders } from './auth';
export { getAuthProviderByName, getSocialByName } from './helpers';
export { siteConfig } from './site';
export { socialConfig } from './social';
export type { AuthProvider, ContentNavItem, NavItem, SiteConfig, Social } from './types';
export {
  validateAuthProviders,
  validateSiteConfig,
  validateSocialConfig,
} from './validation';
