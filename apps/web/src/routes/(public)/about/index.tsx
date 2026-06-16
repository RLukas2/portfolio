import { createFileRoute, Link } from '@tanstack/react-router';
import { siteConfig } from '@xbrk/config';
import { Button } from '@xbrk/ui/button';
import { LazyImage } from '@xbrk/ui/lazy-image';
import { m } from 'framer-motion';
import { DownloadIcon, FileTextIcon } from 'lucide-react';
import Biography from '@/components/about/biography';
import CareerJourney from '@/components/about/career-journey';
import OpenForHire from '@/components/about/open-for-hire';
import { TechStacks } from '@/components/about/tech-stacks';
import PageHeading from '@/components/shared/page-heading';
import { seo } from '@/lib/seo';
import { generateStructuredDataGraph, getAboutPageSchemas } from '@/lib/structured-data';
import { getBaseUrl } from '@/lib/utils';

export const Route = createFileRoute('/(public)/about/')({
  component: RouteComponent,
  head: () => {
    const seoData = seo({
      title: `About | ${siteConfig.title}`,
      description: 'Discover insights about me, my career journey, and more.',
      keywords: ['bio', 'biography', 'information', 'about'].join(', '),
      url: `${getBaseUrl()}/about`,
      canonical: `${getBaseUrl()}/about`,
    });
    const structuredData = generateStructuredDataGraph(getAboutPageSchemas());

    return {
      meta: seoData.meta,
      links: seoData.links,
      scripts: [{ type: 'application/ld+json', children: structuredData }],
    };
  },
});

/**
 * About page route component with sidebar layout displaying personal biography, career journey, and tech stack.
 *
 * Features staggered motion animations for each component:
 * - Sidebar animates from left with fade-in
 * - Each main content section animates individually with increasing delays
 * - Creates a smooth, cascading entrance effect
 *
 * @returns About page with sidebar layout, biography, career timeline, and tech stack showcase
 */
function RouteComponent() {
  return (
    <>
      {/* Decorative gradient glow */}
      <div className="gradient-glow top-0 left-0 h-[600px] w-[600px] opacity-10" />

      <PageHeading description="A short story of me." title="About" />

      <div className="relative mt-8 flex flex-col items-start gap-12 lg:flex-row lg:gap-16">
        {/* Left Sticky Visual container */}
        <m.div
          animate={{ opacity: 1, x: 0 }}
          className="sticky top-24 z-10 flex w-full shrink-0 flex-col gap-6 lg:w-[320px]"
          initial={false}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="glassmorphism overflow-hidden rounded-2xl p-2">
            <LazyImage
              alt={siteConfig.author.name}
              height={400}
              imageClassName="rounded-xl object-cover transition-all duration-700 hover:scale-105 w-full aspect-square"
              priority={true}
              src="/images/avatar.jpg"
              width={400}
            />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-heading text-2xl text-foreground tracking-tight">{siteConfig.author.name}</h3>
            <h4 className="text-lg text-muted-foreground">{siteConfig.author.jobTitle}</h4>
          </div>

          <OpenForHire status={siteConfig.hiringStatus ?? 'off'} />

          <div className="flex flex-col gap-3">
            <Button asChild className="w-full justify-start gap-x-2" size="lg" variant="default">
              <a href="/share/resume.pdf" rel="noopener noreferrer" target="_blank">
                <DownloadIcon className="size-4" />
                Download CV
              </a>
            </Button>

            <Button asChild className="w-full justify-start gap-x-2" size="lg" variant="outline">
              <Link to="/resume">
                <FileTextIcon className="size-4" />
                View Resume
              </Link>
            </Button>
          </div>
        </m.div>

        {/* Right Content Sections */}
        <div className="flex w-full flex-col gap-16 lg:gap-24">
          <m.section
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6"
            initial={false}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
          >
            <h2 className="font-heading text-4xl text-foreground tracking-tight">Who I am</h2>
            <div className="prose prose-lg dark:prose-invert max-w-[65ch] text-muted-foreground">
              <Biography />
            </div>
          </m.section>

          <m.section
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6"
            initial={false}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.4 }}
          >
            <h2 className="font-heading text-4xl text-foreground tracking-tight">What I build</h2>
            <div className="prose prose-lg dark:prose-invert max-w-[65ch] text-muted-foreground">
              <TechStacks />
            </div>
          </m.section>

          <m.section
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6"
            initial={false}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.6 }}
          >
            <div className="flex flex-col gap-2">
              <h2 className="font-heading text-4xl text-foreground tracking-tight">What I've done</h2>
              <p className="text-lg text-muted-foreground">A timeline of my professional experience and education.</p>
            </div>
            <div className="prose prose-lg dark:prose-invert max-w-[65ch]">
              <CareerJourney header={false} />
            </div>
          </m.section>
        </div>
      </div>
    </>
  );
}
