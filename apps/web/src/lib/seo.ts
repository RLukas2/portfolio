import { siteConfig } from '@xbrk/config';
import { getBaseUrl } from './utils';

const OG_LOCALE = 'en_US';

/**
 * Generate SEO meta tags and links for a page.
 *
 * Creates comprehensive meta tags for social media (Twitter, Open Graph),
 * search engines, and canonical URLs.
 *
 * @param options - SEO configuration options
 * @param options.title - Page title (required)
 * @param options.description - Page description for meta tags
 * @param options.keywords - Comma-separated keywords for SEO
 * @param options.author - Content author name
 * @param options.image - Social media preview image URL
 * @param options.type - Open Graph content type
 * @param options.url - Canonical page URL
 * @param options.canonical - Canonical link href
 * @returns Object containing meta tags and link elements
 *
 * @example
 * ```ts
 * const { meta, links } = seo({
 *   title: 'My Blog Post',
 *   description: 'An interesting article',
 *   type: 'article'
 * });
 * ```
 */
export function seo({
  title,
  description,
  keywords,
  author,
  image = `${getBaseUrl()}/site/og-image.jpg`,
  type = 'website',
  url = getBaseUrl(),
  canonical,
}: {
  title: string;
  description?: string | null;
  image?: string | null;
  keywords?: string | null;
  author?: string | null;
  type?: 'website' | 'article' | 'video' | 'book' | 'profile';
  url?: string;
  canonical?: string;
}) {
  const tags: Array<{ title?: string; name?: string; property?: string; content?: string }> = [
    // Basic meta tags
    { title },
    { name: 'author', content: author ?? siteConfig.author.name },
    { name: 'robots', content: 'index, follow' },

    // Twitter Card tags
    { name: 'twitter:title', content: title },
    { name: 'twitter:creator', content: siteConfig.author.handle },
    { name: 'twitter:site', content: siteConfig.author.handle },
    { name: 'twitter:widgets:new-embed-design', content: 'on' },
    { name: 'twitter:url', content: url },

    // Open Graph tags
    { property: 'og:type', content: type },
    { property: 'og:site_name', content: siteConfig.title },
    { property: 'og:title', content: title },
    { property: 'og:locale', content: OG_LOCALE },
    { property: 'og:url', content: url },
  ];

  // Add optional fields
  if (description) {
    tags.push(
      { name: 'description', content: description },
      { name: 'twitter:description', content: description },
      { property: 'og:description', content: description },
    );
  }

  if (keywords) {
    tags.push({ name: 'keywords', content: keywords });
  }

  if (image) {
    const imageAlt = `${title} - ${siteConfig.title}`;
    tags.push(
      { name: 'twitter:image', content: image },
      { name: 'twitter:image:alt', content: imageAlt },
      { name: 'twitter:card', content: 'summary_large_image' },
      { property: 'og:image', content: image },
      { property: 'og:image:alt', content: imageAlt },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
    );
  }

  const links = canonical ? [{ rel: 'canonical', href: canonical }] : [];

  return { meta: tags, links };
}
