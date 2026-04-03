import type { AuthProvider, SiteConfig, Social } from '@xbrk/types';

/**
 * Validation utilities for configuration
 */

// Email validation regex (top-level for performance)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate URL format
 */
function isValidUrl(url: string): boolean {
  if (!url) {
    return false;
  }
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

/**
 * Validate required string field
 */
function validateRequiredString(value: string | undefined, fieldName: string, errors: string[]): void {
  if (!value?.trim()) {
    errors.push(`${fieldName} is required`);
  }
}

/**
 * Validate URL field
 */
function validateUrl(value: string | undefined, fieldName: string, errors: string[], required = true): void {
  if (!value?.trim()) {
    if (required) {
      errors.push(`${fieldName} is required`);
    }
    return;
  }
  if (!isValidUrl(value)) {
    errors.push(`${fieldName} must be a valid URL`);
  }
}

/**
 * Validate email field
 */
function validateEmail(value: string | undefined, fieldName: string, errors: string[], required = true): void {
  if (!value?.trim()) {
    if (required) {
      errors.push(`${fieldName} is required`);
    }
    return;
  }
  if (!isValidEmail(value)) {
    errors.push(`${fieldName} must be a valid email`);
  }
}

/**
 * Validate site configuration
 * @throws Error if configuration is invalid
 */
export function validateSiteConfig(config: SiteConfig): void {
  const errors: string[] = [];

  // Required string fields
  validateRequiredString(config.title, 'title', errors);
  validateRequiredString(config.name, 'name', errors);
  validateRequiredString(config.description, 'description', errors);
  validateRequiredString(config.keywords, 'keywords', errors);

  // URL validation
  validateUrl(config.url, 'url', errors);

  // Author validation
  validateRequiredString(config.author.name, 'author.name', errors);
  validateEmail(config.author.email, 'author.email', errors);
  validateUrl(config.author.url, 'author.url', errors);
  validateRequiredString(config.author.handle, 'author.handle', errors);

  // Links validation
  validateEmail(config.links.mail, 'links.mail', errors);
  validateUrl(config.links.github, 'links.github', errors);
  validateUrl(config.links.githubRepo, 'links.githubRepo', errors);

  // Optional URL fields
  validateUrl(config.links.twitter, 'links.twitter', errors, false);
  validateUrl(config.links.linkedin, 'links.linkedin', errors, false);
  validateUrl(config.calendlyUrl, 'calendlyUrl', errors, false);

  if (errors.length > 0) {
    throw new Error(`Site configuration validation failed:\n- ${errors.join('\n- ')}`);
  }
}

/**
 * Validate social configuration
 * @throws Error if configuration is invalid
 */
export function validateSocialConfig(socials: Social[]): void {
  const errors: string[] = [];

  for (const [index, social] of socials.entries()) {
    if (!social.name?.trim()) {
      errors.push(`socials[${index}].name is required`);
    }
    if (!social.url?.trim()) {
      errors.push(`socials[${index}].url is required`);
    } else if (!isValidUrl(social.url)) {
      errors.push(`socials[${index}].url must be a valid URL`);
    }
    if (!social.icon) {
      errors.push(`socials[${index}].icon is required`);
    }
  }

  if (errors.length > 0) {
    throw new Error(`Social configuration validation failed:\n- ${errors.join('\n- ')}`);
  }
}

/**
 * Validate auth providers configuration
 * @throws Error if configuration is invalid
 */
export function validateAuthProviders(providers: AuthProvider[]): void {
  const errors: string[] = [];

  for (const [index, provider] of providers.entries()) {
    if (!provider.provider?.trim()) {
      errors.push(`authProviders[${index}].provider is required`);
    }
    if (!provider.label?.trim()) {
      errors.push(`authProviders[${index}].label is required`);
    }
    if (!provider.icon) {
      errors.push(`authProviders[${index}].icon is required`);
    }
  }

  if (errors.length > 0) {
    throw new Error(`Auth providers configuration validation failed:\n- ${errors.join('\n- ')}`);
  }
}
