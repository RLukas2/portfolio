import { createFileRoute } from '@tanstack/react-router';
import { siteConfig } from '@xbrk/config';
import { RenderedMarkdown } from '@xbrk/md';
import type { TOC } from '@xbrk/types';
import { m } from 'framer-motion';
import TableOfContents from '@/components/blog/toc';
import PageHeading from '@/components/shared/page-heading';
import { seo } from '@/lib/seo';
import { getBaseUrl } from '@/lib/utils';

export const Route = createFileRoute('/(public)/changelog/')({
  component: RouteComponent,
  loader: async () => {
    const response = await fetch(`${getBaseUrl()}/api/changelog`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.error?.message || 'Failed to load changelog');
    }
    const result = (await response.json()) as { data: { rendering: string; toc: TOC[] } };
    return { rendering: result.data.rendering, toc: result.data.toc ?? [] };
  },
  head: () => {
    const keywords = [...siteConfig.keywords.split(',').map((k) => k.trim()), 'changelog', 'updates', 'releases'].join(
      ', ',
    );

    const seoData = seo({
      title: `Changelog | ${siteConfig.title}`,
      description:
        'Latest updates and improvements to the portfolio. Demonstrating continuous development and commitment to delivering high-quality software.',
      keywords,
      url: `${getBaseUrl()}/changelog`,
      canonical: `${getBaseUrl()}/changelog`,
    });
    return {
      meta: seoData.meta,
      links: seoData.links,
    };
  },
});

function RouteComponent() {
  const { rendering, toc } = Route.useLoaderData();

  return (
    <>
      <PageHeading description="All notable changes and updates to this portfolio website." title="Changelog" />

      <div className="relative pb-24 lg:gap-16 xl:grid xl:max-w-6xl xl:grid-cols-[1fr_250px] 2xl:max-w-7xl">
        <div className="w-full min-w-0 relative">

          {/* Vertical glowing timeline line */}
          <div className="absolute left-4 sm:left-12 top-2 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary/10 to-transparent hidden md:block">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-16 w-[2px] bg-gradient-to-b from-primary to-transparent blur-[2px]" />
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none prose-h2:mt-16 prose-h2:mb-6 prose-h2:pt-8 prose-h2:flex prose-h2:items-center prose-h2:gap-4 prose-h2:border-t prose-h2:border-white/5 md:prose-h2:pl-10 relative z-10
          [&>h2]:before:content-[''] [&>h2]:before:hidden md:[&>h2]:before:block [&>h2]:before:absolute [&>h2]:before:-left-[39px] [&>h2]:before:w-4 [&>h2]:before:h-4 [&>h2]:before:rounded-full [&>h2]:before:bg-background [&>h2]:before:border-2 [&>h2]:before:border-primary [&>h2]:before:shadow-[0_0_10px_rgba(var(--primary),0.5)]
          prose-ul:glass-panel prose-ul:p-6 prose-ul:rounded-2xl prose-ul:my-6 md:prose-ul:ml-10
          prose-li:my-2 prose-li:text-muted-foreground
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
            <RenderedMarkdown rendering={rendering} />
          </div>
        </div>
        {toc.length > 0 && (
          <m.div
            animate={{ opacity: 1, x: 0 }}
            className="hidden text-sm xl:block"
            initial={false}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="sticky top-32 glass-panel p-6 rounded-2xl">
              <h3 className="font-semibold mb-4 text-foreground/80">On this page</h3>
              <TableOfContents toc={toc} />
            </div>
          </m.div>
        )}
      </div>
    </>
  );
}
