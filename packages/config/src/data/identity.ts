import type { AuthProvider, Social } from '../types/identity';

export const authProviders = [
  {
    provider: 'github',
    label: 'GitHub',
    icon: 'github',
  },
  {
    provider: 'twitter',
    label: 'Twitter',
    icon: 'x',
  },
  {
    provider: 'google',
    label: 'Google',
    icon: 'google',
  },
  {
    provider: 'facebook',
    label: 'Facebook',
    icon: 'facebook',
  },
] as const satisfies AuthProvider[];

export const socialConfig = [
  {
    name: 'Twitter',
    url: 'https://twitter.com/rickielukas',
    username: 'rickielukas',
    icon: 'x',
  },
  {
    name: 'GitHub',
    url: 'https://github.com/rlukas2',
    username: 'rlukas2',
    icon: 'github',
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/xbrk',
    username: 'xbrk',
    icon: 'linkedin',
  },
] as const satisfies Social[];
