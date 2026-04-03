import { useSuspenseQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { cn } from '@xbrk/ui';
import { buttonVariants } from '@xbrk/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { containerVariantsFast, itemVariantsDown } from '@/lib/constants/framer-motion-variants';
import { queryKeys } from '@/lib/query-keys';
import { $getAllPublicProjects } from '@/lib/server';
import ProjectCard from '../projects/project-card';

const FeaturedProjects = () => {
  const { data: projects } = useSuspenseQuery({
    queryKey: queryKeys.project.listPublic(),
    queryFn: () => $getAllPublicProjects(),
  });

  // Get only featured projects or first 4 if none are featured
  const featured = projects.filter((p) => p.isFeatured).slice(0, 4);
  const featuredProjects = featured.length > 0 ? featured : projects.slice(0, 4);

  if (featuredProjects.length === 0) {
    return null;
  }

  return (
    <section className="w-full">
      <div className="mb-6 flex flex-col items-center px-1 text-center sm:mb-10">
        <motion.span
          animate={{ opacity: 1 }}
          className="mb-3 font-medium text-primary text-sm uppercase tracking-widest"
          initial={{ opacity: 0 }}
          transition={{ delay: 0.1 }}
        >
          Side Projects
        </motion.span>
        <motion.h2
          animate={{ opacity: 1, y: 0 }}
          className="font-bold text-3xl tracking-tight sm:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.2 }}
        >
          Things I've Built
        </motion.h2>
        <motion.p
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 max-w-2xl text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.3 }}
        >
          Fun stuff I build on weekends and evenings. Some useful, some just for learning.
        </motion.p>
      </div>

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
        <Link className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'group')} to="/projects">
          View all projects
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </motion.div>
    </section>
  );
};

export default FeaturedProjects;
