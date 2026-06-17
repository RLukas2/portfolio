import type { SimpleIcon } from 'simple-icons';

export interface AuthProvider {
  icon: SimpleIcon;
  label: string;
  provider: string;
}

export interface SiteConfig {
  author: {
    name: string;
    email: string;
    url: string;
    handle: string;
    jobTitle?: string;
    location?: string;
    knowsAbout?: string[];
  };
  calendlyUrl?: string;
  description: string;
  hiringStatus?: 'off' | 'open' | 'hired';
  keywords: string;
  links: {
    mail: string;
    twitter?: string;
    github: string;
    githubRepo: string;
    linkedin?: string;
  };
  name: string;
  title: string;
  url: string;
}

export interface Social {
  icon: SimpleIcon;
  name: string;
  url: string;
  username?: string;
}

export interface NavItem {
  content?: ContentNavItem[];
  description?: string;
  disabled?: boolean;
  href?: string;
  title: string;
}

export interface ContentNavItem extends NavItem {
  href: string;
}
