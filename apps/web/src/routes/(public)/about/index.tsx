import { createFileRoute, Link } from '@tanstack/react-router';
import { siteConfig } from '@xbrk/config';
import { Button } from '@xbrk/ui/button';
import { motion } from 'framer-motion';
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
      <PageHeading description="A short story of me." title="About" />

      <div className="items-start space-y-2 xl:grid xl:grid-cols-4 xl:gap-x-6 xl:space-y-0">
        {/* Sidebar - Avatar, Name, Buttons with motion animation */}
        <motion.div
          animate={{ opacity: 1, x: 0 }}
          className="group flex flex-col items-center xl:sticky xl:top-24"
          initial={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <img
            alt={siteConfig.author.name}
            className="rounded-full object-cover transition-all duration-300 hover:scale-105 xl:rounded-lg"
            height={256}
            loading="eager"
            src="/images/avatar.jpg"
            width={256}
          />
          <div className="m-0 flex flex-col items-center py-2">
            <h3 className="m-0 font-cal text-xl">{siteConfig.author.name}</h3>
            <h4 className="m-0 text-muted-foreground">{siteConfig.author.jobTitle}</h4>
          </div>
          <OpenForHire status={siteConfig.hiringStatus ?? 'off'} />

          <div className="my-4 flex flex-col gap-4">
            <Button asChild className="gap-x-2 shadow-lg" variant="shadow">
              <a href="/share/resume.pdf" rel="noopener noreferrer" target="_blank">
                <DownloadIcon className="size-4" />
                Download CV
              </a>
            </Button>

            <Button asChild className="gap-x-1 shadow-lg" variant="shadow">
              <Link to="/resume">
                <FileTextIcon className="size-4" />
                View Resume
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Main Content - Each section animates individually */}
        <div className="prose prose-neutral dark:prose-invert max-w-none xl:col-span-3">
          {/* Biography section */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
          >
            <Biography />
          </motion.div>

          {/* Tech Stack section */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.4 }}
          >
            <h2 className="font-cal text-3xl">Tech Stack</h2>
            <TechStacks />
          </motion.div>

          {/* Career Journey section */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.6 }}
          >
            <h2 className="font-cal text-3xl">Career Journey</h2>
            <p className="m-0! text-muted-foreground">A timeline of my professional experience and education.</p>
            <CareerJourney header={true} />
          </motion.div>
        </div>
      </div>
    </>
  );
}
