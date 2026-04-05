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
    ],
  },
  {
    header: 'Community',
    links: [
      {
        title: 'Guestbook',
        path: '/guestbook',
      },
    ],
  },
] as const;
