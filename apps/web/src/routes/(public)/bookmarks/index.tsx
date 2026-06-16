import { createFileRoute, Link } from '@tanstack/react-router';
import { siteConfig } from '@xbrk/config';
import type { Collection } from '@xbrk/types';
import { m } from 'framer-motion';
import { ArrowUpRight, Bookmark, FolderOpen } from 'lucide-react';
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
  hidden: { opacity: 0, scale: 0.95, filter: 'blur(5px)' },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.4, ease: "circOut" as const },
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
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 pb-24">
          {/* Left Column: Information / Sticky Sidebar */}
          <div className="w-full md:w-1/3 lg:w-1/4 shrink-0">
             <div className="md:sticky md:top-32 flex flex-col gap-6">
                <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-background/40">
                   <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                         <Bookmark className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-heading font-semibold text-xl">Collections</h3>
                   </div>
                   <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                      A curated list of resources, articles, tools, and inspiration I've collected across the web.
                   </p>
                   <div className="flex items-center justify-between text-sm pt-4 border-t border-white/10">
                      <span className="text-muted-foreground">Total Folders</span>
                      <span className="font-mono font-medium">{collections.length}</span>
                   </div>
                </div>
             </div>
          </div>

          {/* Right Column: Grid of Collections */}
          <div className="flex-1">
            <m.div animate="visible" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" initial={false} variants={containerVariants}>
              {collections.map((collection: Collection) => (
                <m.div key={collection._id} variants={itemVariants} className="h-full">
                  <Link
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/5 bg-background/40 backdrop-blur-md p-5 sm:p-6 transition-all duration-500 hover:border-white/20 hover:shadow-xl hover:-translate-y-1"
                    params={{
                      bookmarkId: collection.slug,
                    }}
                    to="/bookmarks/$bookmarkId"
                  >
                    <div className="relative flex flex-col h-full gap-4">
                      <div className="flex items-start justify-between w-full">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background border border-white/5 shadow-inner transition-colors duration-500 group-hover:bg-primary/10 group-hover:border-primary/20">
                          <FolderOpen className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-primary" />
                        </div>
                        <div className="h-8 w-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0">
                          <ArrowUpRight className="h-4 w-4 text-primary" />
                        </div>
                      </div>

                      <div className="mt-auto pt-4 flex flex-col gap-1">
                        <h2 className="font-heading font-semibold text-xl tracking-tight text-foreground/80 transition-colors group-hover:text-foreground line-clamp-2">
                          {collection.title}
                        </h2>
                        <span className="inline-flex items-center gap-1.5 text-muted-foreground/60 text-sm font-mono mt-2">
                          {collection.count} items
                        </span>
                      </div>
                    </div>
                  </Link>
                </m.div>
              ))}
            </m.div>
          </div>
        </div>
      )}
    </>
  );
}
