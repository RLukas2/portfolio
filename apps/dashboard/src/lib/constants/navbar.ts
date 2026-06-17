import type { NavItem } from '@xbrk/config';

/**
 * Dashboard Navigation Links
 *
 * Defines the main navigation structure for the admin dashboard.
 * Each item represents a section of the CMS.
 *
 * Sections:
 * - Dashboard: Overview and statistics
 * - Blog: Manage blog posts
 * - Projects: Manage portfolio projects
 * - Experiences: Manage work history and education
 * - Snippets: Manage code snippets
 * - Services: Manage service offerings
 * - Users: User management (admin only)
 */
export const dashboardNavbarLinks: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/',
  },
  {
    title: 'Blog',
    href: '/blog',
  },
  {
    title: 'Projects',
    href: '/projects',
  },
  {
    title: 'Experiences',
    href: '/experiences',
  },
  {
    title: 'Snippets',
    href: '/snippets',
  },
  {
    title: 'Services',
    href: '/services',
  },
  {
    title: 'Users',
    href: '/users',
  },
];
