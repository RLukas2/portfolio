import { Readable } from 'node:stream';
import { createFileRoute } from '@tanstack/react-router';
import { SitemapStream, streamToPromise } from 'sitemap';
import { getBaseUrl } from '@/lib/utils';

const SITE_URL = getBaseUrl();

interface SitemapItem {
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  lastmod?: Date | string;
  priority?: number;
  url: string;
}

async function generateSitemap(): Promise<string> {
  // Maybe Promise for dynamic data in the future

  const staticPages: SitemapItem[] = [
    {
      url: '/',
      priority: 1.0,
      changefreq: 'daily',
    },
  ];

  // Add dynamic pages here if needed

  const allPages = [...staticPages];

  const stream = new SitemapStream({ hostname: SITE_URL });
  const xmlBuffer = await streamToPromise(Readable.from(allPages).pipe(stream));

  return xmlBuffer.toString();
}

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        try {
          const sitemap = await generateSitemap();

          return new Response(sitemap, {
            headers: {
              'Content-Type': 'application/xml',
              'Cache-Control': 'public, max-age=0, s-maxage=3600', // Cache for 1 hour
            },
          });
        } catch (error) {
          console.error('Error generating sitemap:', error);
          return new Response('Internal Server Error', { status: 500 });
        }
      },
    },
  },
});
