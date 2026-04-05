import { createFileRoute } from '@tanstack/react-router';
import { siteConfig } from '@xbrk/config';
import PageHeading from '@/components/shared/page-heading';
import Uses from '@/components/uses/uses';
import { seo } from '@/lib/seo';
import { getBaseUrl } from '@/lib/utils';

export const Route = createFileRoute('/(public)/uses/')({
  component: RouteComponent,
  head: () => {
    const seoData = seo({
      title: `Uses | ${siteConfig.title}`,
      description:
        'Professional development tools and tech stack used to build high-quality websites and web applications. Industry-standard tools for modern software development.',
      keywords:
        'Web Development Tools, Professional Tech Stack, Software Development Setup, React Development Tools, TypeScript Tools, Modern Development Environment',
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
      <PageHeading
        description={
          'These are the tools I use to get my work done. Links marked with (*) are affiliate links. It does not cost you anything to use them, but I get a small commission if you do.'
        }
        title={'Uses'}
      />

      <Uses />
    </>
  );
}
