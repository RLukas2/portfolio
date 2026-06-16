import { useSuspenseQuery } from '@tanstack/react-query';
import { cn } from '@xbrk/ui';
import { buttonVariants } from '@xbrk/ui/button';
import { m, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import Link from '@/components/shared/link';
import { containerVariantsFast, itemVariantsDown } from '@/lib/constants/framer-motion-variants';
import { queryKeys } from '@/lib/query-keys';
import { $getAllPublicProjects } from '@/lib/server';
import ProjectCard from '../projects/project-card';
import EmptyState from '../shared/empty-state';

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const FeaturedProjects = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const { data: projects } = useSuspenseQuery({
    queryKey: queryKeys.project.listPublic(),
    queryFn: () => $getAllPublicProjects(),
  });

  // Get featured projects, or fallback
  const featured = projects.filter((p) => p.isFeatured).slice(0, 5);
  const featuredProjects = featured.length > 0 ? featured : projects.slice(0, 5);

  return (
    <m.section
      animate={isInView ? 'visible' : 'hidden'}
      className="w-full"
      id="featured-projects"
      initial={false}
      ref={sectionRef}
      transition={{ duration: 0.5 }}
      variants={sectionVariants}
    >
      <div className="my-12 flex flex-col items-center px-1 py-4 text-center sm:mb-16">
        <m.span
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          className="mb-4 inline-flex items-center rounded-full border border-white/10 bg-background/50 px-3 py-1 font-medium text-xs backdrop-blur-md"
          initial={false}
          transition={{ delay: 0.1 }}
        >
          Selected Work
        </m.span>
        <m.h2
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          className="font-bold text-4xl tracking-tight sm:text-5xl"
          initial={false}
          transition={{ delay: 0.2 }}
        >
          Featured Projects
        </m.h2>
        <m.p
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          className="mt-4 max-w-2xl text-lg text-muted-foreground"
          initial={false}
          transition={{ delay: 0.3 }}
        >
          A selection of things I've built, exploring new technologies and solving interesting problems.
        </m.p>
      </div>

      {featuredProjects.length > 0 ? (
        <>
          <m.div
            animate={isInView ? 'visible' : 'hidden'}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6"
            initial={false}
            variants={containerVariantsFast}
          >
            {featuredProjects.map((project, index) => {
              // Asymmetrical layout logic
              let colSpan = "lg:col-span-2"; // default small
              let minHeight = "min-h-[300px]";

              if (index === 0) {
                colSpan = "lg:col-span-4 lg:row-span-2";
                minHeight = "min-h-[400px] lg:min-h-[600px]";
              } else if (index === 1 || index === 2) {
                colSpan = "lg:col-span-2";
                minHeight = "min-h-[300px]";
              } else if (index === 3) {
                 colSpan = "lg:col-span-3";
                 minHeight = "min-h-[350px]";
              } else if (index === 4) {
                 colSpan = "lg:col-span-3";
                 minHeight = "min-h-[350px]";
              }

              return (
                <m.div key={project.slug} variants={itemVariantsDown} className={cn("flex", colSpan)}>
                  <ProjectCard project={project} className={cn("w-full", minHeight)} />
                </m.div>
              );
            })}
          </m.div>

          <m.div
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            className="mt-16 flex justify-center"
            initial={false}
            transition={{ delay: 0.5 }}
          >
            <Link className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'group rounded-full bg-background/50 backdrop-blur-md border-white/10')} href="/projects">
              View all projects
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </m.div>
        </>
      ) : (
        <EmptyState message="The projects are probably off having a party somewhere without us!" />
      )}
    </m.section>
  );
};

export default FeaturedProjects;
