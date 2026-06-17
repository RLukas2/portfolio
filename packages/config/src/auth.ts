import { siFacebook, siGithub, siGoogle, siX } from 'simple-icons';
import type { AuthProvider } from './types';

/**
 * Authentication providers configuration
 * Defines available OAuth providers for user authentication
 */
export const authProviders: AuthProvider[] = [
  {
    provider: 'github',
    label: 'GitHub',
    icon: siGithub,
  },
  {
    provider: 'twitter',
    label: 'Twitter',
    icon: siX,
  },
  {
    provider: 'google',
    label: 'Google',
    icon: siGoogle,
  },
  {
    provider: 'facebook',
    label: 'Facebook',
    icon: siFacebook,
  },
];
