import type { ProjectType } from '@xbrk/types';
import { m, AnimatePresence } from 'framer-motion';
import { containerVariantsFast, itemVariantsDown } from '@/lib/constants/framer-motion-variants';
import EmptyState from '../shared/empty-state';
import ProjectCard from './project-card';
import { cn } from '@xbrk/ui';

interface ProjectsProps {
  projects: ProjectType[];
}

export default function Projects({ projects }: Readonly<ProjectsProps>) {
  if (projects.length === 0) {
    return <EmptyState message="The projects are probably off having a party somewhere without us!" />;
  }

  return (
    <div className="flex flex-col gap-8">
      <AnimatePresence mode="wait">
        <m.div
          animate="visible"
          initial="hidden"
          exit="hidden"
          variants={containerVariantsFast}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6"
        >
          {projects.map((project, index) => {
            // Asymmetrical immersive grid layout logic
            let colSpan = "lg:col-span-3"; // default half width
            let minHeight = "min-h-[350px] lg:min-h-[450px]";

            // Every 5th item is featured full width
            if (index % 5 === 0) {
              colSpan = "lg:col-span-6";
              minHeight = "min-h-[400px] lg:min-h-[600px]";
            } else if (index % 5 === 1 || index % 5 === 2) {
              // Two items side by side
              colSpan = "lg:col-span-3";
            } else if (index % 5 === 3) {
               // 2/3 width
               colSpan = "lg:col-span-4";
            } else if (index % 5 === 4) {
               // 1/3 width
               colSpan = "lg:col-span-2";
            }

            return (
              <m.div key={project.slug} variants={itemVariantsDown} className={cn("flex", colSpan)}>
                <ProjectCard project={project} className={cn("w-full", minHeight)} />
              </m.div>
            );
          })}
        </m.div>
      </AnimatePresence>
    </div>
  );
}
