import { useSuspenseQuery } from '@tanstack/react-query';
import { cn } from '@xbrk/ui';
import { buttonVariants } from '@xbrk/ui/button';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import Link from '@/components/shared/link';
import { containerVariantsFast, itemVariantsDown } from '@/lib/constants/framer-motion-variants';
import { queryKeys } from '@/lib/query-keys';
import { $getAllPublicProjects } from '@/lib/server';
import ProjectCard from '../projects/project-card';
import EmptyState from '../shared/empty-state';

/**
 * Animation variants for the featured projects section
 * Controls the fade-in and slide-up animation when section comes into view
 */
const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

/**
 * FeaturedProjects component displays a curated selection of highlighted projects on the home page.
 *
 * This component fetches all public projects and filters them to show only featured projects
 * (marked with isFeatured flag). If no projects are marked as featured, it displays the first 4
 * projects instead. The component includes smooth scroll-triggered animations and a link to view
 * all projects.
 *
 * Features:
 * - Server-side data fetching with TanStack Query (suspense mode)
 * - Automatic filtering of featured projects (max 4 displayed)
 * - Fallback to first 4 projects if none are featured
 * - Scroll-triggered animations using Framer Motion
 * - Responsive grid layout (1 column mobile, 2 columns desktop)
 * - Empty state handling when no projects exist
 * - Direct Tailwind classes (no Container component abstraction)
 *
 * Layout:
 * - Section header with title and description
 * - Grid of ProjectCard components (2 columns on desktop)
 * - "View all projects" button at the bottom
 *
 * @returns Rendered featured projects section with animations and project cards
 *
 * @example
 * ```tsx
 * <FeaturedProjects />
 * ```
 */
const FeaturedProjects = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const { data: projects } = useSuspenseQuery({
    queryKey: queryKeys.project.listPublic(),
    queryFn: () => $getAllPublicProjects(),
  });

  // Get only featured projects or first 4 if none are featured
  const featured = projects.filter((p) => p.isFeatured).slice(0, 4);
  const featuredProjects = featured.length > 0 ? featured : projects.slice(0, 4);

  return (
    <motion.section
      animate={isInView ? 'visible' : 'hidden'}
      className="w-full"
      id="featured-projects"
      initial="hidden"
      ref={sectionRef}
      transition={{ duration: 0.5 }}
      variants={sectionVariants}
    >
      <div className="my-8 flex flex-col items-center px-1 py-4 text-center sm:mb-10">
        <motion.span
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          className="mb-3 font-medium text-primary text-sm uppercase tracking-widest"
          initial={{ opacity: 0 }}
          transition={{ delay: 0.1 }}
        >
          Side Projects
        </motion.span>
        <motion.h2
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          className="font-bold text-3xl tracking-tight sm:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.2 }}
        >
          Things I've Built
        </motion.h2>
        <motion.p
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          className="mt-3 max-w-2xl text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.3 }}
        >
          Fun stuff I build on weekends and evenings. Some useful, some just for learning.
        </motion.p>
      </div>

      {featuredProjects.length > 0 ? (
        <>
          <motion.div
            animate="visible"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6"
            initial="hidden"
            variants={containerVariantsFast}
            viewport={{ once: true }}
            whileInView="visible"
          >
            {featuredProjects.map((project) => (
              <motion.div key={project.slug} variants={itemVariantsDown}>
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.5 }}
          >
            <Link className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'group')} href="/projects">
              View all projects
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </>
      ) : (
        <EmptyState message="The projects are probably off having a party somewhere without us!" />
      )}
    </motion.section>
  );
};

export default FeaturedProjects;
