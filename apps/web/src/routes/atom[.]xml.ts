import { createFileRoute } from '@tanstack/react-router';
import { blogService } from '@xbrk/api';
import { siteConfig } from '@xbrk/config';
import { db } from '@xbrk/db/client';
import { getBaseUrl } from '@/lib/utils';

const SITE_URL = getBaseUrl();

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function generateAtomFeed(): Promise<string> {
  const articles = await blogService.getAllPublic(db);

  const latestArticle = articles[0];
  const updated = latestArticle?.updatedAt ?? latestArticle?.createdAt ?? new Date();

  const entries = articles
    .map((article) => {
      const published = new Date(article.createdAt).toISOString();
      const updatedDate = new Date(article.updatedAt ?? article.createdAt).toISOString();
      const link = `${SITE_URL}/blog/${article.slug}`;
      const description = escapeXml(article.description ?? '');
      const title = escapeXml(article.title);

      return `  <entry>
    <title>${title}</title>
    <link href="${link}" />
    <id>${link}</id>
    <published>${published}</published>
    <updated>${updatedDate}</updated>
    <summary type="html">${description}</summary>
    <author>
      <name>${escapeXml(siteConfig.author.name)}</name>
      <email>${siteConfig.author.email}</email>
      <uri>${SITE_URL}</uri>
    </author>
    ${article.tags?.map((tag) => `<category term="${escapeXml(tag)}" />`).join('\n    ') ?? ''}
    ${article.imageUrl ? `<link rel="enclosure" href="${escapeXml(article.imageUrl)}" type="image/jpeg" />` : ''}
  </entry>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(siteConfig.title)} - Blog</title>
  <link href="${SITE_URL}/blog" />
  <link href="${SITE_URL}/atom.xml" rel="self" type="application/atom+xml" />
  <id>${SITE_URL}/blog</id>
  <updated>${new Date(updated).toISOString()}</updated>
  <subtitle>${escapeXml(siteConfig.description)}</subtitle>
  <author>
    <name>${escapeXml(siteConfig.author.name)}</name>
    <email>${siteConfig.author.email}</email>
    <uri>${SITE_URL}</uri>
  </author>
  <rights>Copyright ${new Date().getFullYear()} ${escapeXml(siteConfig.author.name)}</rights>
${entries}
</feed>`;
}

export const Route = createFileRoute('/atom.xml')({
  server: {
    handlers: {
      GET: async () => {
        try {
          const feed = await generateAtomFeed();

          return new Response(feed, {
            headers: {
              'Content-Type': 'application/atom+xml; charset=utf-8',
              'Cache-Control': 'public, max-age=0, s-maxage=3600',
            },
          });
        } catch (error) {
          console.error('Error generating Atom feed:', error instanceof Error ? error.message : error);
          return new Response('Error generating Atom feed', {
            status: 500,
            headers: { 'Content-Type': 'text/plain' },
          });
        }
      },
    },
  },
});
