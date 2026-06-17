import { siGithub, siLinkedin, siX } from 'simple-icons';
import type { Social } from './types';

/**
 * Social media profiles configuration
 * Used for displaying social links throughout the site
 */
export const socialConfig: Social[] = [
  {
    name: 'Twitter',
    url: 'https://twitter.com/rickielukas',
    username: 'rickielukas',
    icon: siX,
  },
  {
    name: 'Github',
    url: 'https://github.com/rlukas2',
    username: 'rlukas2',
    icon: siGithub,
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/xbrk',
    username: 'xbrk',
    icon: siLinkedin,
  },
];
