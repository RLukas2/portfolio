/**
 * SEO metadata for all pages
 * Centralized location for page-specific SEO configurations
 */

export interface PageSEO {
  description: string;
  keywords: string;
}

export const seoData: Record<string, PageSEO> = {
  blog: {
    description:
      'Expert insights on web development, React, TypeScript, and building scalable business applications. Learn best practices for modern software development.',
    keywords:
      'Web Development Blog, React Tutorials, TypeScript Best Practices, Software Development Tips, Business Application Development, Full-Stack Development Guide',
  },
  projects: {
    description:
      'Portfolio of custom websites, web applications, and business software solutions. See real examples of scalable, high-performance projects delivered for clients.',
    keywords:
      'Web Development Portfolio, Custom Website Examples, Business Software Projects, React Applications, Full-Stack Development Work, Client Projects',
  },
  uses: {
    description:
      'Professional development tools and tech stack used to build high-quality websites and web applications. Industry-standard tools for modern software development.',
    keywords:
      'Web Development Tools, Professional Tech Stack, Software Development Setup, React Development Tools, TypeScript Tools, Modern Development Environment',
  },
  stats: {
    description:
      'Development activity and contributions on GitHub. Track record of consistent coding and open source contributions demonstrating active development expertise.',
    keywords:
      'Developer Statistics, GitHub Activity, Open Source Contributions, Active Developer, Coding Activity, Software Development Track Record',
  },
  guestbook: {
    description:
      'Client testimonials and feedback from collaborations. See what others say about working with a professional full-stack developer.',
    keywords:
      'Developer Reviews, Client Testimonials, Web Developer Feedback, Professional References, Collaboration Reviews',
  },
};
