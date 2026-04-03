/**
 * Static data for page headings and descriptions
 * Centralized location for all page metadata
 */

export interface PageData {
  description: string;
  title: string;
}

export const pagesData: Record<string, PageData> = {
  blog: {
    title: 'Blog',
    description:
      'On my blog, I have written {count} items in total. In the search box below, you can look for articles by title.',
  },
  projects: {
    title: 'Projects',
    description: 'Several projects that I have worked on, both private and open source.',
  },
  snippets: {
    title: 'Snippets',
    description: 'A collection of code snippets that I use in my projects.',
  },
  uses: {
    title: 'Uses',
    description:
      'These are the tools I use to get my work done. Links marked with (*) are affiliate links. It does not cost you anything to use them, but I get a small commission if you do.',
  },
  stats: {
    title: 'Statistics',
    description: 'Development activity and open source contributions',
  },
  guestbook: {
    title: 'Guestbook',
    description: 'A place for you to leave your comments and feedback.',
  },
  profile: {
    title: 'Profile',
    description: 'Manage your account settings and preferences',
  },
};
