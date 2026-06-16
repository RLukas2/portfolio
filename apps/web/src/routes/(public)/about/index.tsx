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

function RouteComponent() {
  return (
    <div className="relative pb-24">
      {/* Background gradients for added depth */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[500px] bg-gradient-to-b from-primary/5 via-background to-background" />

      <div className="relative z-10 flex flex-col xl:flex-row gap-12 lg:gap-24 items-start">
        {/* Sticky Visual Sidebar */}
        <m.div
          animate={{ opacity: 1, x: 0 }}
          className="w-full xl:w-1/3 fade-in slide-in-from-left-8 flex flex-col items-center xl:items-start duration-700 xl:sticky xl:top-32"
          initial={false}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="relative group w-64 h-64 xl:w-full xl:h-auto xl:aspect-square mb-8 rounded-3xl overflow-hidden glass-panel p-2">
            <LazyImage
              alt={siteConfig.author.name}
              height={512}
              imageClassName="object-cover w-full h-full rounded-2xl transition-transform duration-700 group-hover:scale-105"
              priority={true}
              src="/images/avatar.jpg"
              width={512}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
          </div>

          <div className="flex flex-col items-center xl:items-start text-center xl:text-left gap-4 w-full">
            <div>
              <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                {siteConfig.author.name}
              </h1>
              <p className="text-xl text-muted-foreground mt-2">{siteConfig.author.jobTitle}</p>
            </div>

            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent xl:via-white/10 xl:to-transparent xl:from-white/10 my-2" />

            <OpenForHire status={siteConfig.hiringStatus ?? 'off'} />

            <div className="flex flex-col gap-3 w-full mt-4">
              <Button asChild className="gap-x-2 rounded-full w-full justify-center group" variant="shadow" size="lg">
                <a href="/share/resume.pdf" rel="noopener noreferrer" target="_blank">
                  <DownloadIcon className="size-4 transition-transform group-hover:-translate-y-1" />
                  Download Resume
                </a>
              </Button>

              <Button asChild className="gap-x-2 rounded-full w-full justify-center group bg-background/50 backdrop-blur-md border border-white/10 hover:bg-background/80 hover:text-foreground" variant="outline" size="lg">
                <Link to="/resume">
                  <FileTextIcon className="size-4 transition-transform group-hover:-translate-y-1" />
                  View Online CV
                </Link>
              </Button>
            </div>
          </div>
        </m.div>

        {/* Scrolling Content Sections */}
        <div className="w-full xl:w-2/3 flex flex-col gap-24 xl:pt-4">
          {/* Biography section */}
          <m.section
            animate={{ opacity: 1, y: 0 }}
            initial={false}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            <div className="flex items-center gap-4 mb-2">
              <h2 className="font-heading text-3xl font-bold tracking-tight">The Story</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
            </div>
            <div className="prose prose-lg dark:prose-invert max-w-none prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
              <Biography />
            </div>
          </m.section>

          {/* Tech Stack section */}
          <m.section
            animate={{ opacity: 1, y: 0 }}
            initial={false}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.4 }}
            className="flex flex-col gap-6"
          >
            <div className="flex items-center gap-4 mb-2">
              <h2 className="font-heading text-3xl font-bold tracking-tight">Arsenal</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              I love exploring new tools and languages, but here is my primary stack for building scalable and reliable products.
            </p>
            <TechStacks />
          </m.section>

          {/* Career Journey section */}
          <m.section
            animate={{ opacity: 1, y: 0 }}
            initial={false}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.6 }}
            className="flex flex-col gap-6"
          >
            <div className="flex items-center gap-4 mb-2">
              <h2 className="font-heading text-3xl font-bold tracking-tight">Experience</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              A timeline of my professional journey and continuous learning.
            </p>
            <CareerJourney header={false} />
          </m.section>
        </div>
      </div>
    </div>
  );
}
