import { Readable } from 'node:stream';
import { createFileRoute } from '@tanstack/react-router';
import { blogService, projectService, serviceService, snippetService } from '@xbrk/api';
import { db } from '@xbrk/db/client';
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
  const [projects, articles, snippets, services] = await Promise.all([
    projectService.getAllPublic(db),
    blogService.getAllPublic(db),
    snippetService.getAllPublic(db),
    serviceService.getAllPublic(db),
  ]);

  const staticPages: SitemapItem[] = [
    { url: '/', priority: 1.0, changefreq: 'daily' },
    { url: '/about', priority: 1.0, changefreq: 'daily' },
    { url: '/projects', priority: 1.0, changefreq: 'daily' },
    { url: '/blog', priority: 1.0, changefreq: 'daily' },
    { url: '/bookmarks', priority: 1.0, changefreq: 'daily' },
    { url: '/stats', priority: 1.0, changefreq: 'daily' },
    { url: '/snippets', priority: 1.0, changefreq: 'daily' },
    { url: '/uses', priority: 1.0, changefreq: 'daily' },
    { url: '/guestbook', priority: 1.0, changefreq: 'daily' },
  ];

  const projectPages: SitemapItem[] = projects.map((project) => ({
    url: `/projects/${project.slug}`,
    lastmod: project.updatedAt ?? undefined,
    priority: 0.8,
    changefreq: 'weekly' as const,
  }));

  const articlePages: SitemapItem[] = articles.map((article) => ({
    url: `/blog/${article.slug}`,
    lastmod: article.updatedAt ?? undefined,
    priority: 0.8,
    changefreq: 'weekly' as const,
  }));

  const snippetPages: SitemapItem[] = snippets.map((snippet) => ({
    url: `/snippets/${snippet.slug}`,
    lastmod: snippet.updatedAt ?? undefined,
    priority: 0.7,
    changefreq: 'monthly' as const,
  }));

  const servicePages: SitemapItem[] = services.map((service) => ({
    url: `/services/${service.slug}`,
    lastmod: service.updatedAt ?? undefined,
    priority: 0.8,
    changefreq: 'weekly' as const,
  }));

  const allPages = [...staticPages, ...projectPages, ...articlePages, ...snippetPages, ...servicePages];

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
