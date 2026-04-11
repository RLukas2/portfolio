import { createFileRoute } from '@tanstack/react-router';
import { blogService } from '@xbrk/api';
import { siteConfig } from '@xbrk/config';
import { db } from '@xbrk/db/client';
import { getBaseUrl } from '@/lib/utils';

const SITE_URL = getBaseUrl();

interface JsonFeedItem {
  author: {
    name: string;
    url: string;
    avatar?: string;
  };
  content_html?: string;
  date_modified?: string;
  date_published: string;
  id: string;
  image?: string;
  summary?: string;
  tags?: string[];
  title: string;
  url: string;
}

interface JsonFeed {
  author: {
    name: string;
    url: string;
    avatar?: string;
  };
  description: string;
  favicon?: string;
  feed_url: string;
  home_page_url: string;
  icon?: string;
  items: JsonFeedItem[];
  language: string;
  title: string;
  version: string;
}

async function generateJsonFeed(): Promise<JsonFeed> {
  const articles = await blogService.getAllPublic(db);

  const items: JsonFeedItem[] = articles.map((article) => ({
    id: `${SITE_URL}/blog/${article.slug}`,
    url: `${SITE_URL}/blog/${article.slug}`,
    title: article.title,
    summary: article.description ?? undefined,
    image: article.imageUrl ?? undefined,
    date_published: new Date(article.createdAt).toISOString(),
    date_modified: article.updatedAt ? new Date(article.updatedAt).toISOString() : undefined,
    tags: article.tags ?? undefined,
    author: {
      name: siteConfig.author.name,
      url: SITE_URL,
    },
  }));

  return {
    version: 'https://jsonfeed.org/version/1.1',
    title: `${siteConfig.title} - Blog`,
    home_page_url: `${SITE_URL}/blog`,
    feed_url: `${SITE_URL}/feed.json`,
    description: siteConfig.description,
    icon: `${SITE_URL}/android-chrome-512x512.png`,
    favicon: `${SITE_URL}/favicon.ico`,
    author: {
      name: siteConfig.author.name,
      url: SITE_URL,
    },
    language: 'en',
    items,
  };
}

export const Route = createFileRoute('/feed.json')({
  server: {
    handlers: {
      GET: async () => {
        try {
          const feed = await generateJsonFeed();

          return new Response(JSON.stringify(feed, null, 2), {
            headers: {
              'Content-Type': 'application/feed+json; charset=utf-8',
              'Cache-Control': 'public, max-age=0, s-maxage=3600',
            },
          });
        } catch (error) {
          console.error('Error generating JSON feed:', error instanceof Error ? error.message : error);
          return new Response('Error generating JSON feed', {
            status: 500,
            headers: { 'Content-Type': 'text/plain' },
          });
        }
      },
    },
  },
});
