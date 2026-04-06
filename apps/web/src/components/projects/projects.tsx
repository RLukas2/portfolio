import type { ProjectType } from '@xbrk/types';
import { motion } from 'framer-motion';
import { slideInWithFadeOut } from '@/lib/constants/framer-motion-variants';
import EmptyState from '../shared/empty-state';
import ProjectCard from './project-card';

interface ProjectsProps {
  projects: ProjectType[];
}

export default function Projects({ projects }: Readonly<ProjectsProps>) {
  if (projects.length === 0) {
    return <EmptyState message="The projects are probably off having a party somewhere without us!" />;
  }

  return (
    <motion.div
      animate="visible"
      className="grid grid-cols-1 gap-8 sm:grid-cols-2"
      initial="hidden"
      variants={slideInWithFadeOut}
    >
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </motion.div>
  );
}
