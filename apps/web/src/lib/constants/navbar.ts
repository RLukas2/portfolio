import type { ContentNavItem, NavItem } from '@xbrk/types';
import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  Bookmark,
  BookOpen,
  Code,
  FileText,
  FolderKanban,
  History,
  Home,
  Monitor,
  User,
} from 'lucide-react';

/**
 * Extended content navigation item with icon support.
 */
export interface ContentNavItemWithIcon extends ContentNavItem {
  icon?: LucideIcon;
}

/**
 * Extended navigation item with icon support for command palette and navigation menus.
 */
export interface NavItemWithIcon extends Omit<NavItem, 'content'> {
  content?: ContentNavItemWithIcon[];
  icon?: LucideIcon;
}

/**
 * Navigation links for the application header and mobile menu.
 * Each link includes an icon for use in the command palette.
 *
 * Icons used:
 * - Home: Home page
 * - User: About page
 * - FolderKanban: Projects page
 * - FileText: Blog page
 * - Code: Snippets page
 * - FileCode: Shorts page
 * - Briefcase: Resume page
 * - BarChart3: Stats page
 * - Monitor: Uses page
 * - Bookmark: Bookmarks page
 * - BookOpen: Guestbook page
 * - Medal: Endorsements page
 * - History: Changelog page
 */
export const navbarLinks: NavItemWithIcon[] = [
  {
    title: 'Home',
    href: '/',
    icon: Home,
  },
  {
    title: 'About',
    href: '/about',
    icon: User,
  },
  {
    title: 'Blog',
    href: '/blog',
    icon: FileText,
  },
  {
    title: 'Projects',
    href: '/projects',
    icon: FolderKanban,
  },
  {
    title: 'More',
    content: [
      {
        title: 'Snippets',
        href: '/snippets',
        description: 'Code snippets that I use often. Mostly for personal reference.',
        icon: Code,
      },
      {
        title: 'Stats',
        href: '/stats',
        description: 'My personal statistics about coding and other things.',
        icon: BarChart3,
      },
      {
        title: 'Uses',
        href: '/uses',
        description: 'My hardware, software, and other tools.',
        icon: Monitor,
      },
      {
        title: 'Bookmarks',
        href: '/bookmarks',
        description: 'My bookmarks from the web.',
        icon: Bookmark,
      },
      {
        title: 'Guestbook',
        href: '/guestbook',
        description: 'A place for you to leave your comments and feedback.',
        icon: BookOpen,
      },
      {
        title: 'Changelog',
        href: '/changelog',
        description: 'All notable changes and updates to this website.',
        icon: History,
      },
    ],
  },
];
