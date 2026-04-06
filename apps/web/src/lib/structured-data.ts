import { siteConfig, socialConfig } from '@xbrk/config';
import { getBaseUrl } from './utils';

// Cached once at module load — avoids repeated env lookups per SSR request
const BASE_URL = getBaseUrl();
const COPYRIGHT_YEAR = new Date().getFullYear();

const DEFAULT_LANGUAGE = 'en-US';

// Cache for base schemas that don't change between requests
let cachedPersonSchema: Person | null = null;
let cachedOrganizationSchema: Organization | null = null;
let cachedWebSiteSchema: WebSite | null = null;

// =============================================================================
// Schema Types
// =============================================================================

type SchemaObject =
  | Person
  | Organization
  | WebSite
  | ProfilePage
  | CollectionPage
  | BreadcrumbList
  | BlogPosting
  | SoftwareSourceCode;

interface WithId {
  '@id'?: string;
}

type Person = WithId & {
  '@type': 'Person';
  name: string;
  url: string;
  sameAs: string[];
  image?: string;
  jobTitle?: string;
  worksFor?: Organization;
  email?: string;
  knowsAbout?: string[];
};

type Organization = WithId & {
  '@type': 'Organization';
  name: string;
  url: string;
  logo?: string;
};

type BlogPosting = WithId & {
  '@type': 'BlogPosting';
  mainEntityOfPage: { '@type': 'WebPage'; '@id': string };
  headline: string;
  description: string;
  image: string;
  author: Person | { '@id': string };
  publisher: Organization | { '@id': string };
  datePublished: string;
  dateModified: string;
  url: string;
  keywords?: string;
  wordCount?: number;
  articleSection?: string;
  inLanguage?: string;
};

type WebSite = WithId & {
  '@type': 'WebSite';
  name: string;
  url: string;
  description: string;
  author: Person | { '@id': string };
  publisher: Organization | { '@id': string };
  inLanguage: string;
  copyrightYear: number;
  copyrightHolder: Person | { '@id': string };
  potentialAction?: SearchAction;
};

interface SearchAction {
  '@type': 'SearchAction';
  'query-input': string;
  target: { '@type': 'EntryPoint'; urlTemplate: string };
}

type ProfilePage = WithId & {
  '@type': 'ProfilePage';
  name: string;
  url: string;
  description: string;
  mainEntity: Person | { '@id': string };
  isPartOf: { '@id': string };
  inLanguage: string;
};

type CollectionPage = WithId & {
  '@type': 'CollectionPage';
  name: string;
  url: string;
  description: string;
  isPartOf: { '@id': string };
  inLanguage: string;
};

type BreadcrumbList = WithId & {
  '@type': 'BreadcrumbList';
  itemListElement: BreadcrumbItem[];
};

interface BreadcrumbItem {
  '@type': 'ListItem';
  item: string;
  name: string;
  position: number;
}

type SoftwareSourceCode = WithId & {
  '@type': 'SoftwareSourceCode';
  name: string;
  description: string;
  url: string;
  image?: string;
  author: Person | { '@id': string };
  dateCreated?: string;
  dateModified?: string;
  programmingLanguage?: string[];
  codeRepository?: string;
  runtimePlatform?: string;
  applicationCategory?: string;
};

// =============================================================================
// Schema IDs
// =============================================================================

const schemaIds = {
  person: () => `${BASE_URL}/#person`,
  organization: () => `${BASE_URL}/#organization`,
  website: () => `${BASE_URL}/#website`,
  webpage: (path: string) => `${BASE_URL}${path}#webpage`,
} as const;

// =============================================================================
// Internal Helpers
// =============================================================================

function normalizeImageUrl(image: string | undefined): string | undefined {
  if (!image) {
    return;
  }
  if (image.startsWith('http')) {
    return image;
  }
  return `${BASE_URL}${image}`;
}

function createPersonSchema(options?: { includeId?: boolean }): Person {
  // Return cached version if available and options match
  if (cachedPersonSchema && options?.includeId) {
    return cachedPersonSchema;
  }

  const schema: Person = {
    '@type': 'Person',
    name: siteConfig.author.name,
    url: BASE_URL,
    sameAs: socialConfig.map((social) => social.url),
    image: `${BASE_URL}/images/avatar.avif`,
    jobTitle: siteConfig.author.jobTitle,
    email: siteConfig.author.email,
    worksFor: {
      '@type': 'Organization',
      name: 'Freelance',
      url: BASE_URL,
    },
    knowsAbout: siteConfig.author.knowsAbout,
  };

  if (options?.includeId) {
    schema['@id'] = schemaIds.person();
    cachedPersonSchema = schema;
  }

  return schema;
}

function createOrganizationSchema(options?: { includeId?: boolean }): Organization {
  // Return cached version if available and options match
  if (cachedOrganizationSchema && options?.includeId) {
    return cachedOrganizationSchema;
  }

  const schema: Organization = {
    '@type': 'Organization',
    name: siteConfig.title,
    url: BASE_URL,
    logo: `${BASE_URL}/images/icon.svg`,
  };

  if (options?.includeId) {
    schema['@id'] = schemaIds.organization();
    cachedOrganizationSchema = schema;
  }

  return schema;
}

function createWebSiteSchema(options?: { includeId?: boolean; useRefs?: boolean }): WebSite {
  // Return cached version if available and options match
  if (cachedWebSiteSchema && options?.includeId && options?.useRefs) {
    return cachedWebSiteSchema;
  }

  const schema: WebSite = {
    '@type': 'WebSite',
    name: siteConfig.title,
    url: BASE_URL,
    description: siteConfig.description,
    author: options?.useRefs ? { '@id': schemaIds.person() } : createPersonSchema(),
    publisher: options?.useRefs ? { '@id': schemaIds.organization() } : createOrganizationSchema(),
    inLanguage: DEFAULT_LANGUAGE,
    copyrightYear: COPYRIGHT_YEAR,
    copyrightHolder: options?.useRefs ? { '@id': schemaIds.person() } : createPersonSchema(),
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/blog?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  if (options?.includeId) {
    schema['@id'] = schemaIds.website();
    if (options?.useRefs) {
      cachedWebSiteSchema = schema;
    }
  }

  return schema;
}

function createProfilePageSchema(title: string, description: string, path: string): ProfilePage {
  return {
    '@type': 'ProfilePage',
    '@id': `${BASE_URL}${path}#profilepage`,
    name: title,
    url: `${BASE_URL}${path}`,
    description,
    mainEntity: { '@id': schemaIds.person() },
    isPartOf: { '@id': schemaIds.website() },
    inLanguage: DEFAULT_LANGUAGE,
  };
}

function createCollectionPageSchema(title: string, description: string, path: string): CollectionPage {
  return {
    '@type': 'CollectionPage',
    '@id': `${BASE_URL}${path}#collectionpage`,
    name: title,
    url: `${BASE_URL}${path}`,
    description,
    isPartOf: { '@id': schemaIds.website() },
    inLanguage: DEFAULT_LANGUAGE,
  };
}

function createBreadcrumbSchema(items: { name: string; path: string }[]): BreadcrumbList {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.path}`,
    })),
  };
}

function createBlogPostingSchema({
  title,
  description,
  image,
  datePublished,
  dateModified,
  path,
  keywords,
  wordCount,
}: {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  path: string;
  keywords?: string;
  wordCount?: number;
}): BlogPosting {
  const url = `${BASE_URL}${path}`;
  return {
    '@type': 'BlogPosting',
    '@id': `${url}#blogposting`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: title,
    description,
    image: image.startsWith('http') ? image : `${BASE_URL}${image}`,
    author: { '@id': schemaIds.person() },
    publisher: { '@id': schemaIds.organization() },
    datePublished,
    dateModified,
    url,
    keywords,
    wordCount,
    inLanguage: DEFAULT_LANGUAGE,
  };
}

function createSoftwareProjectSchema({
  title,
  description,
  path,
  image,
  githubUrl,
  stacks,
  dateCreated,
  dateModified,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  githubUrl?: string;
  stacks?: string[];
  dateCreated?: string;
  dateModified?: string;
}): SoftwareSourceCode {
  const url = `${BASE_URL}${path}`;
  return {
    '@type': 'SoftwareSourceCode',
    '@id': `${url}#software`,
    name: title,
    description,
    url,
    image: normalizeImageUrl(image),
    author: { '@id': schemaIds.person() },
    codeRepository: githubUrl,
    programmingLanguage: stacks,
    dateCreated,
    dateModified,
    applicationCategory: 'DeveloperApplication',
  };
}

// =============================================================================
// Public API
// =============================================================================

/**
 * Generates a JSON-LD structured data graph for SEO.
 *
 * Wraps schema objects in a @graph structure for embedding in HTML.
 *
 * @param schemas - Array of schema.org objects
 * @returns JSON-LD string ready for script tag insertion
 *
 * @example
 * ```tsx
 * <script type="application/ld+json">
 *   {generateStructuredDataGraph(getHomepageSchemas())}
 * </script>
 * ```
 */
export function generateStructuredDataGraph(schemas: SchemaObject[]): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': schemas,
  });
}

/**
 * Gets structured data schemas for the homepage.
 *
 * Includes Person, Organization, and WebSite schemas.
 *
 * @returns Array of schema objects for homepage
 */
export function getHomepageSchemas(): SchemaObject[] {
  return [
    createPersonSchema({ includeId: true }),
    createOrganizationSchema({ includeId: true }),
    createWebSiteSchema({ includeId: true, useRefs: true }),
  ];
}

/**
 * Gets structured data schemas for the about page.
 *
 * Includes Person, Organization, WebSite, ProfilePage, and Breadcrumb schemas.
 *
 * @returns Array of schema objects for about page
 */
export function getAboutPageSchemas(): SchemaObject[] {
  return [
    createPersonSchema({ includeId: true }),
    createOrganizationSchema({ includeId: true }),
    createWebSiteSchema({ includeId: true, useRefs: true }),
    createProfilePageSchema(`About | ${siteConfig.title}`, 'About me and my journey as a software engineer.', '/about'),
    createBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'About', path: '/about' },
    ]),
  ];
}

/**
 * Gets structured data schemas for the blog listing page.
 *
 * Includes Person, Organization, WebSite, CollectionPage, and Breadcrumb schemas.
 *
 * @returns Array of schema objects for blog list page
 */
export function getBlogListSchemas(): SchemaObject[] {
  return [
    createPersonSchema({ includeId: true }),
    createOrganizationSchema({ includeId: true }),
    createWebSiteSchema({ includeId: true, useRefs: true }),
    createCollectionPageSchema(
      `Blog | ${siteConfig.title}`,
      'Thoughts, tutorials, and insights about web development.',
      '/blog',
    ),
    createBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Blog', path: '/blog' },
    ]),
  ];
}

/**
 * Gets structured data schemas for a blog post page.
 *
 * Includes Person, Organization, WebSite, BlogPosting, and Breadcrumb schemas.
 *
 * @param post - Blog post metadata
 * @returns Array of schema objects for blog post page
 */
export function getBlogPostSchemas(post: {
  title: string;
  description: string;
  image: string;
  slug: string;
  datePublished: string;
  dateModified: string;
  keywords?: string;
  wordCount?: number;
}): SchemaObject[] {
  const path = `/blog/${post.slug}`;
  return [
    createPersonSchema({ includeId: true }),
    createOrganizationSchema({ includeId: true }),
    createWebSiteSchema({ includeId: true, useRefs: true }),
    createBlogPostingSchema({
      title: post.title,
      description: post.description,
      image: post.image,
      datePublished: post.datePublished,
      dateModified: post.dateModified,
      path,
      keywords: post.keywords,
      wordCount: post.wordCount,
    }),
    createBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Blog', path: '/blog' },
      { name: post.title, path },
    ]),
  ];
}

/**
 * Gets structured data schemas for the projects listing page.
 *
 * Includes Person, Organization, WebSite, CollectionPage, and Breadcrumb schemas.
 *
 * @returns Array of schema objects for projects list page
 */
export function getProjectListSchemas(): SchemaObject[] {
  return [
    createPersonSchema({ includeId: true }),
    createOrganizationSchema({ includeId: true }),
    createWebSiteSchema({ includeId: true, useRefs: true }),
    createCollectionPageSchema(
      `Projects | ${siteConfig.title}`,
      'Several projects that I have worked on, both private and open source.',
      '/projects',
    ),
    createBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Projects', path: '/projects' },
    ]),
  ];
}

/**
 * Gets structured data schemas for a project detail page.
 *
 * Includes Person, Organization, WebSite, SoftwareSourceCode, and Breadcrumb schemas.
 *
 * @param project - Project metadata
 * @returns Array of schema objects for project page
 */
export function getProjectSchemas(project: {
  title: string;
  description: string;
  slug: string;
  image?: string;
  githubUrl?: string;
  stacks?: string[];
  dateCreated?: string;
  dateModified?: string;
}): SchemaObject[] {
  const path = `/projects/${project.slug}`;
  return [
    createPersonSchema({ includeId: true }),
    createOrganizationSchema({ includeId: true }),
    createWebSiteSchema({ includeId: true, useRefs: true }),
    createSoftwareProjectSchema({
      title: project.title,
      description: project.description,
      path,
      image: project.image,
      githubUrl: project.githubUrl,
      stacks: project.stacks,
      dateCreated: project.dateCreated,
      dateModified: project.dateModified,
    }),
    createBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Projects', path: '/projects' },
      { name: project.title, path },
    ]),
  ];
}
