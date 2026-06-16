import type { ProjectType } from '@xbrk/types';
import { m } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from '@/components/shared/link';
import { slideInWithFadeOut } from '@/lib/constants/framer-motion-variants';
import EmptyState from '../shared/empty-state';

interface ProjectsProps {
  projects: ProjectType[];
}

export default function Projects({ projects }: Readonly<ProjectsProps>) {
  if (projects.length === 0) {
    return <EmptyState message="The projects are probably off having a party somewhere without us!" />;
  }

  const featuredProjects = projects.filter((p) => p.isFeatured);
  const regularProjects = projects.filter((p) => !p.isFeatured);

  return (
    <m.div animate="visible" className="flex flex-col gap-24" initial={false} variants={slideInWithFadeOut}>
      {/* Featured Showcase */}
      {featuredProjects.length > 0 && (
        <div className="flex flex-col gap-16">
          {featuredProjects.map((project, index) => (
            <Link
              className={`group flex flex-col gap-8 no-underline ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              } items-center`}
              key={project.slug}
              params={{ projectId: project.slug }}
              to="/projects/$projectId"
            >
              {/* Large Image */}
              <div className="glassmorphism relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-muted transition-transform duration-500 group-hover:scale-[1.02] md:w-3/5">
                {project.imageUrl && (
                  <img
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    height={500}
                    src={project.imageUrl}
                    width={800}
                  />
                )}
                {/* Subtle Glow inside image container */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>

              {/* Content side */}
              <div className="flex w-full flex-col gap-4 p-4 md:w-2/5 md:p-8">
                <div className="font-medium text-primary text-sm uppercase tracking-widest">Featured</div>
                <h3 className="font-heading text-4xl transition-colors group-hover:text-primary">{project.title}</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">{project.description}</p>
                <div className="mt-4 flex items-center gap-2 font-medium text-primary">
                  Read case study <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Supporting Projects */}
      {regularProjects.length > 0 && (
        <div className="flex flex-col gap-8 border-border/50 border-t pt-16">
          <h2 className="font-heading text-3xl">Other Works</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {regularProjects.map((project) => (
              <Link
                className="group hover:glassmorphism flex flex-col gap-4 rounded-xl border border-transparent p-4 no-underline transition-all"
                key={project.slug}
                params={{ projectId: project.slug }}
                to="/projects/$projectId"
              >
                {project.imageUrl && (
                  <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                    <img
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      height={400}
                      src={project.imageUrl}
                      width={600}
                    />
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <h3 className="font-heading text-xl transition-colors group-hover:text-primary">{project.title}</h3>
                  <p className="line-clamp-2 text-muted-foreground">{project.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </m.div>
  );
}
