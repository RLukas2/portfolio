import { siFacebook, siGithub, siGoogle, siX } from 'simple-icons';

export type AuthProvider = 'github' | 'twitter' | 'google' | 'facebook';

export const AUTH_PROVIDERS = [
  { provider: 'github' as const, icon: siGithub, label: 'Continue with Github' },
  { provider: 'twitter' as const, icon: siX, label: 'Continue with Twitter (X)' },
  { provider: 'google' as const, icon: siGoogle, label: 'Continue with Google' },
  { provider: 'facebook' as const, icon: siFacebook, label: 'Continue with Facebook' },
] as const;
