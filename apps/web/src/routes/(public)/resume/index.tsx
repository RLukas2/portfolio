import { createFileRoute } from '@tanstack/react-router';
import { siteConfig } from '@xbrk/config';
import { Button } from '@xbrk/ui/button';
import { DownloadIcon, PrinterIcon } from 'lucide-react';
import CareerJourney from '@/components/about/career-journey';
import PageHeading from '@/components/shared/page-heading';
import { seo } from '@/lib/seo';
import { getBaseUrl } from '@/lib/utils';
import { m } from 'framer-motion';

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

function RouteComponent() {
  return (
    <div className="relative pb-32">
      {/* Floating Action Bar */}
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 glass-panel p-2 rounded-full border border-white/10 shadow-2xl flex items-center gap-2 print:hidden"
      >
        <Button asChild variant="ghost" className="rounded-full gap-2 px-6 hover:bg-background/50 hover:text-foreground text-muted-foreground">
           <a href="/share/resume.pdf" rel="noopener noreferrer" target="_blank">
             <DownloadIcon className="size-4" />
             Download PDF
           </a>
        </Button>
        <div className="w-px h-6 bg-white/10" />
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-background/50 text-muted-foreground hover:text-foreground" onClick={() => window.print()}>
           <PrinterIcon className="size-4" />
        </Button>
      </m.div>

      <PageHeading description="My professional journey, experience, and education." title="Resume" />

      {/* Notion-like editorial document layout */}
      <div className="max-w-4xl mx-auto glass-panel border-t border-x border-white/5 rounded-t-3xl p-8 sm:p-12 lg:p-16 mt-12 bg-background/40 backdrop-blur-3xl shadow-2xl relative overflow-hidden">

        {/* Subtle decorative top border gradient */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        {/* Document Header */}
        <div className="border-b border-white/10 pb-12 mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
           <div>
              <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight mb-2">{siteConfig.author.name}</h1>
              <p className="text-xl text-primary font-medium">{siteConfig.author.jobTitle}</p>
           </div>
           <div className="flex flex-col gap-1 text-sm text-muted-foreground text-right">
              <a href={`mailto:${siteConfig.author.email}`} className="hover:text-primary transition-colors">{siteConfig.author.email}</a>
              <a href={siteConfig.url} className="hover:text-primary transition-colors">Portfolio</a>
              <span>Ho Chi Minh City, Vietnam</span>
           </div>
        </div>

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h2 className="font-heading text-2xl font-semibold mb-8 flex items-center gap-4">
             Experience & Education
             <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
          </h2>
          <CareerJourney header={false} />
        </div>
      </div>
    </div>
  );
}
