import { createFileRoute } from '@tanstack/react-router';
import { siteConfig } from '@xbrk/config';
import { RenderedMarkdown } from '@xbrk/md';
import { m } from 'framer-motion';
import TableOfContents from '@/components/blog/toc';
import PageHeading from '@/components/shared/page-heading';
import { seo } from '@/lib/seo';
import { getBaseUrl } from '@/lib/utils';
import type { TOC } from '@/types/misc';

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

      <div className="relative lg:gap-10 xl:grid xl:max-w-6xl xl:grid-cols-[1fr_250px] 2xl:max-w-7xl">
        <div className="w-full min-w-0">
          <div className="prose prose-slate dark:prose-invert max-w-none">
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
            <div className="sticky top-20">
              <TableOfContents toc={toc} />
            </div>
          </m.div>
        )}
      </div>
    </>
  );
}
