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

async function generateRssFeed(): Promise<string> {
  const articles = await blogService.getAllPublic(db);

  const latestArticle = articles[0];
  const lastBuildDate = latestArticle?.updatedAt ?? latestArticle?.createdAt ?? new Date();

  const items = articles
    .map((article) => {
      const pubDate = new Date(article.createdAt).toUTCString();
      const link = `${SITE_URL}/blog/${article.slug}`;
      const description = escapeXml(article.description ?? '');
      const title = escapeXml(article.title);

      return `    <item>
      <title>${title}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${description}</description>
      <pubDate>${pubDate}</pubDate>
      ${article.tags?.map((tag) => `<category>${escapeXml(tag)}</category>`).join('\n      ') ?? ''}
      ${article.imageUrl ? `<enclosure url="${escapeXml(article.imageUrl)}" type="image/jpeg" />` : ''}
    </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.title)} - Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>en</language>
    <lastBuildDate>${new Date(lastBuildDate).toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <webMaster>${siteConfig.author.email} (${escapeXml(siteConfig.author.name)})</webMaster>
    <managingEditor>${siteConfig.author.email} (${escapeXml(siteConfig.author.name)})</managingEditor>
    <copyright>Copyright ${new Date().getFullYear()} ${escapeXml(siteConfig.author.name)}</copyright>
    <ttl>60</ttl>
${items}
  </channel>
</rss>`;
}

export const Route = createFileRoute('/rss.xml')({
  server: {
    handlers: {
      GET: async () => {
        try {
          const feed = await generateRssFeed();

          return new Response(feed, {
            headers: {
              'Content-Type': 'application/rss+xml; charset=utf-8',
              'Cache-Control': 'public, max-age=0, s-maxage=3600',
            },
          });
        } catch (error) {
          console.error('Error generating RSS feed:', error instanceof Error ? error.message : error);
          return new Response('Error generating RSS feed', {
            status: 500,
            headers: { 'Content-Type': 'text/plain' },
          });
        }
      },
    },
  },
});
