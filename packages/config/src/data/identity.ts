import type { AuthProvider, Social } from '../types/identity';

export const authProviders: AuthProvider[] = [
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
];

export const socialConfig: Social[] = [
  {
    name: 'Twitter',
    url: 'https://twitter.com/rickielukas',
    username: 'rickielukas',
    icon: 'x',
  },
  {
    name: 'Github',
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
];
