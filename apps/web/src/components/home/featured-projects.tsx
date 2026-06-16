import type { ProjectType } from '@xbrk/types';
import { cn } from '@xbrk/ui';
import { buttonVariants } from '@xbrk/ui/button';
import { m, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import Link from '@/components/shared/link';
import { containerVariantsFast, itemVariantsDown } from '@/lib/constants/framer-motion-variants';
import EmptyState from '../shared/empty-state';

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

interface FeaturedProjectsProps {
  featuredProjects: ProjectType[];
}

const FeaturedProjects = ({ featuredProjects }: Readonly<FeaturedProjectsProps>) => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <m.section
      animate={isInView ? 'visible' : 'hidden'}
      className="relative w-full py-16 sm:py-24"
      id="featured-projects"
      initial={false}
      ref={sectionRef}
      transition={{ duration: 0.5 }}
      variants={sectionVariants}
    >
      <div className="mb-12">
        <m.h2
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          className="font-heading text-4xl tracking-tight sm:text-5xl"
          initial={false}
          transition={{ delay: 0.2 }}
        >
          Selected Works
        </m.h2>
        <m.p
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          className="mt-4 max-w-2xl text-lg text-muted-foreground"
          initial={false}
          transition={{ delay: 0.3 }}
        >
          Things I've built. Some useful, some just for learning.
        </m.p>
      </div>

      {featuredProjects.length > 0 ? (
        <div className="flex flex-col gap-12 sm:gap-16">
          <m.div
            animate={isInView ? 'visible' : 'hidden'}
            className="flex flex-col gap-12"
            initial={false}
            variants={containerVariantsFast}
          >
            {featuredProjects.map((project) => (
              <m.div className="group relative" key={project.slug} variants={itemVariantsDown}>
                <Link
                  className="flex flex-col items-start gap-6 no-underline transition-opacity hover:opacity-80 sm:flex-row sm:items-center"
                  params={{ projectId: project.slug }}
                  to="/projects/$projectId"
                >
                  {project.imageUrl && (
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-muted sm:w-1/2">
                      <img
                        alt={project.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        height={400}
                        src={project.imageUrl}
                        width={600}
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col gap-3">
                    <h3 className="font-heading text-2xl transition-colors group-hover:text-primary">
                      {project.title}
                    </h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">{project.description}</p>
                    <div className="mt-2 flex items-center gap-2 font-medium text-primary">
                      View project <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </m.div>
            ))}
          </m.div>

          <m.div
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            className="flex"
            initial={false}
            transition={{ delay: 0.5 }}
          >
            <Link className={cn(buttonVariants({ variant: 'ghost', size: 'lg' }), 'group -ml-4')} href="/projects">
              View all projects
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </m.div>
        </div>
      ) : (
        <EmptyState message="The projects are probably off having a party somewhere without us!" />
      )}
    </m.section>
  );
};

export default FeaturedProjects;
