import { createFileRoute } from '@tanstack/react-router';
import { siteConfig } from '@xbrk/config';
import PageHeading from '@/components/shared/page-heading';
import Uses from '@/components/uses/uses';
import { pagesData } from '@/lib/data/pages-data';
import { seoData as seoMetadata } from '@/lib/data/seo-data';
import { seo } from '@/lib/seo';
import { getBaseUrl } from '@/lib/utils';

export const Route = createFileRoute('/(public)/uses/')({
  component: RouteComponent,
  head: () => {
    const seoData = seo({
      title: `Uses | ${siteConfig.title}`,
      description: seoMetadata.uses.description,
      keywords: seoMetadata.uses.keywords,
      url: `${getBaseUrl()}/uses`,
      canonical: `${getBaseUrl()}/uses`,
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
      <PageHeading description={pagesData.uses.description} title={pagesData.uses.title} />

      <Uses />
    </>
  );
}
