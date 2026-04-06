import type { SimpleIcon } from 'simple-icons';

/**
 * Main site configuration
 * Contains metadata, author info, and external links
 */
export interface SiteConfig {
  /** Author information */
  author: {
    name: string;
    email: string;
    url: string;
    handle: string;
    jobTitle?: string;
    location?: string;
    knowsAbout?: string[];
  };

  /** Optional Calendly integration */
  calendlyUrl?: string;
  /** Website description */
  description: string;
  /** Hiring status for the author */
  hiringStatus?: 'off' | 'open' | 'hired';
  /** Keywords used to describe the website */
  keywords: string;

  /** External links */
  links: {
    mail: string;
    twitter?: string;
    github: string;
    githubRepo: string;
    linkedin?: string;
  };

  name: string;
  /** Site metadata */
  title: string;
  url: string;
}

/**
 * Social media profile configuration
 */
export interface Social {
  icon: SimpleIcon;
  name: string;
  url: string;
  username?: string;
}

/**
 * Navigation item for site menus
 */
export interface NavItem {
  content?: ContentNavItem[];
  description?: string;
  disabled?: boolean;
  href?: string;
  title: string;
}

/**
 * Navigation item with required href (for content pages)
 */
export interface ContentNavItem extends NavItem {
  href: string;
}
