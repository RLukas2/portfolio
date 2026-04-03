import { createFileRoute } from '@tanstack/react-router';
import { siteConfig } from '@xbrk/config';
import PageHeading from '@/components/shared/page-heading';
import { pagesData } from '@/lib/data/pages-data';
import { seoData as seoMetadata } from '@/lib/data/seo-data';
import { seo } from '@/lib/seo';
import { getBaseUrl } from '@/lib/utils';

export const Route = createFileRoute('/(public)/stats/')({
  component: RouteComponent,
  head: () => {
    const seoData = seo({
      title: `Stats | ${siteConfig.title}`,
      description: seoMetadata.stats.description,
      keywords: seoMetadata.stats.keywords,
      url: `${getBaseUrl()}/stats`,
      canonical: `${getBaseUrl()}/stats`,
    });

    return {
      meta: seoData.meta,
      links: seoData.links,
    };
  },
});

function RouteComponent() {
  return (
    <>
      <PageHeading description={pagesData.stats.description} title={pagesData.stats.title} />
      {/* <Stats /> */}
    </>
  );
}
