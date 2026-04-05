import { createFileRoute } from '@tanstack/react-router';
import { siteConfig } from '@xbrk/config';

import CareerJourney from '@/components/about/career-journey';
import PageHeading from '@/components/shared/page-heading';
import { seo } from '@/lib/seo';
import { getBaseUrl } from '@/lib/utils';

export const Route = createFileRoute('/(public)/resume/')({
  component: RouteComponent,
  head: () => {
    const seoData = seo({
      title: `Resume | ${siteConfig.title}`,
      description: 'View my professional resume including work experience, education, and skills.',
      keywords: ['resume', 'cv', 'curriculum vitae', 'work experience', 'education', 'skills', 'career'].join(' '),
      url: `${getBaseUrl()}/resume`,
      canonical: `${getBaseUrl()}/resume`,
    });

    return {
      meta: seoData.meta,
      links: seoData.links,
    };
  },
});

/**
 * Resume page route component displaying professional experience and education timeline.
 *
 * Features:
 * - Page heading with description
 * - Career journey timeline with experiences and education
 * - Download PDF button for resume
 * - Last updated date display
 * - Uses direct Tailwind classes (no Container component)
 *
 * Layout already provides container, so no additional container wrapper is needed.
 *
 * @returns Resume page with career timeline and download functionality
 */
function RouteComponent() {
  return (
    <div className="space-y-8">
      <PageHeading description="My professional journey, experience, and education." title="Resume" />

      <h2 className="font-cal text-3xl">Career Journey</h2>
      <p className="m-0! text-muted-foreground">A timeline of my professional experience and education.</p>
      <CareerJourney downloadButton header />
    </div>
  );
}
