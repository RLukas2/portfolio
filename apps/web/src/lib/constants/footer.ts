/**
 * Footer navigation links organized by category.
 * Used in the footer component to display site navigation.
 */
export const FOOTER_LINKS = [
  {
    header: 'General',
    links: [
      {
        title: 'Home',
        path: '/',
      },
      {
        title: 'About',
        path: '/about',
      },
      {
        title: 'Stats',
        path: '/stats',
      },
      {
        title: 'Projects',
        path: '/projects',
      },
    ],
  },
  {
    header: 'Content',
    links: [
      {
        title: 'Blog',
        path: '/blog',
      },
      {
        title: 'Snippets',
        path: '/snippets',
      },
      {
        title: 'Uses',
        path: '/uses',
      },
      {
        title: 'Bookmarks',
        path: '/bookmarks',
      },
    ],
  },
  {
    header: 'Community',
    links: [
      {
        title: 'Guestbook',
        path: '/guestbook',
      },
      {
        title: 'Changelog',
        path: '/changelog',
      },
    ],
  },
] as const;
