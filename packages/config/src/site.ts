import type { SiteConfig } from '@xbrk/types';

/**
 * Main site configuration
 * Contains metadata, author information, and external links
 */
export const siteConfig: SiteConfig = {
  title: 'Tuan Ngo-Hoang',
  name: 'rickielukas',
  description: 'Full-stack Developer and Software Engineer',
  hiringStatus: 'open',
  keywords: 'web development, software engineering, portfolio',
  url: 'https://xbrk.dev',
  author: {
    name: 'Ngô Hoàng Tuấn',
    email: 'nhtuan314@gmail.com',
    url: 'https://xbrk.dev',
    handle: '@rickielukas',
    jobTitle: 'Software Engineer',
    location: 'Vietnam',
    knowsAbout: ['Web Development', 'TypeScript', 'React', 'Node.js', 'Full-stack Development'],
  },
  links: {
    mail: 'nhtuan314@gmail.com',
    twitter: 'https://twitter.com/rickielukas',
    github: 'https://github.com/rlukas2',
    githubRepo: 'https://github.com/rlukas2/portfolio-dev',
    linkedin: 'https://www.linkedin.com/in/xbrk',
  },
  calendlyUrl: '',
};
