import type { SiteConfig, Social } from '@xbrk/types';
import { siGithub, siLinkedin, siX } from 'simple-icons';

export const siteConfig: SiteConfig = {
  title: 'Tuan Ngo-Hoang',
  name: 'rickielukas',
  description: '',
  keywords: '',
  url: '',
  author: {
    name: 'Tuan Ngo-Hoang',
    email: 'nhtuan314@gmail.com',
    url: '',
    handle: '@rickielukas',
    jobTitle: '',
    knowsAbout: [],
  },
  links: {
    mail: 'nhtuan314@gmail.com',
    twitter: 'https://twitter.com/rickielukas',
    github: 'https://github.com/rlukas2',
    githubRepo: 'https://github.com/rlukas2/portfolio-dev',
  },
};

export const socialConfig: Social[] = [
  {
    name: 'Twitter',
    url: 'https://twitter.com/rickielukas',
    username: 'rickielukas',
    icon: siX,
  },
  {
    name: 'Github',
    url: 'https://github.com/RLukas2',
    username: 'RLukas2',
    icon: siGithub,
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/xbrk',
    username: 'xbrk',
    icon: siLinkedin,
  },
];
