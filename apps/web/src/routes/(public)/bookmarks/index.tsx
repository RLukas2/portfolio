import { createFileRoute, Link } from '@tanstack/react-router';
import { siteConfig } from '@xbrk/config';
import type { Collection } from '@xbrk/types';
import { m } from 'framer-motion';
import { ArrowRight, Bookmark, FolderOpen } from 'lucide-react';
import EmptyState from '@/components/shared/empty-state';
import PageHeading from '@/components/shared/page-heading';
import { getCollections } from '@/lib/integrations/raindrop';
import { seo } from '@/lib/seo';
import { getBaseUrl } from '@/lib/utils';

export const Route = createFileRoute('/(public)/bookmarks/')({
  loader: async () => {
    const result = await getCollections();
    return { collections: result?.items ?? [] };
  },
  component: RouteComponent,
  head: () => {
    const seoData = seo({
      title: `Bookmarks | ${siteConfig.title}`,
      description: 'Discoveries from the World Wide Web',
      keywords: siteConfig.keywords,
      url: `${getBaseUrl()}/bookmarks`,
      canonical: `${getBaseUrl()}/bookmarks`,
    });
    return {
      meta: seoData.meta,
      links: seoData.links,
    };
  },
});

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

function RouteComponent() {
  const { collections } = Route.useLoaderData();

  return (
    <>
      <PageHeading description="Discoveries from the World Wide Web" title="Bookmarks" />

      {collections.length === 0 ? (
        <EmptyState message="No bookmarks found yet. We are discovering favorite discoveries!" />
      ) : (
        <m.div animate="visible" className="grid gap-4 sm:grid-cols-2" initial={false} variants={containerVariants}>
          {collections.map((collection: Collection) => (
            <m.div key={collection._id} variants={itemVariants}>
              <Link
                className="glassmorphism group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl p-6 no-underline transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                params={{
                  bookmarkId: collection.slug,
                }}
                to="/bookmarks/$bookmarkId"
              >
                <div className="relative flex items-start justify-between gap-3">
                  {/* Icon */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <FolderOpen size={24} />
                  </div>

                  {/* Arrow indicator */}
                  <ArrowRight
                    className="shrink-0 text-muted-foreground/50 transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary"
                    size={24}
                  />
                </div>

                <div className="relative mt-6 flex flex-1 flex-col gap-2">
                  <h2 className="font-heading text-2xl tracking-tight transition-colors group-hover:text-primary">
                    {collection.title}
                  </h2>
                  <span className="inline-flex items-center gap-1.5 text-lg text-muted-foreground">
                    <Bookmark size={16} />
                    {collection.count} bookmarks
                  </span>
                </div>
              </Link>
            </m.div>
          ))}
        </m.div>
      )}
    </>
  );
}
