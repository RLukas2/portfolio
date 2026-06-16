import { type ProjectType } from '@xbrk/types';
import { LazyImage } from '@xbrk/ui/lazy-image';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import Link from '@/components/shared/link';
import TechStacks from '../shared/tech-stacks';
import { cn } from '@xbrk/ui';

interface ProjectCardProps {
  project: ProjectType;
  className?: string;
}

const ProjectCard = ({ project, className }: ProjectCardProps) => {
  const { title, description, slug, imageUrl, isFeatured, stacks } = project;
  const thumbnailUrl = imageUrl ?? `https://placehold.co/500x320/darkgray/white/png?text=${encodeURIComponent(title)}`;

  return (
    <Link
      className={cn("group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl glass-card", className)}
      params={{
        projectId: slug,
      }}
      to="/projects/$projectId"
    >
      {/* Hover gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {isFeatured && (
        <div className="absolute top-4 left-4 z-[2] flex items-center gap-1.5 rounded-full bg-background/80 backdrop-blur-md border border-white/10 px-3 py-1 font-medium text-foreground text-xs shadow-lg">
          <Sparkles size={12} className="text-amber-500" />
          <span>Featured</span>
        </div>
      )}

      {/* Image container */}
      <div className="relative w-full overflow-hidden flex-1 min-h-[240px]">
        <LazyImage
          alt={description ?? ''}
          height={600}
          imageClassName="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          src={thumbnailUrl}
          width={800}
        />
        {/* Gradient overlay on image */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />

        {/* View indicator */}
        <div className="absolute right-4 bottom-4 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 font-medium text-neutral-900 text-sm opacity-0 shadow-lg backdrop-blur-sm transition-all duration-500 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
          <span>View Project</span>
          <ArrowUpRight
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            size={14}
          />
        </div>
      </div>

      {/* Content overlayed on image for immersive feel */}
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 flex flex-col gap-3 z-10 bg-gradient-to-t from-background via-background/80 to-transparent pt-12">
        <h3 className="font-semibold text-2xl tracking-tight transition-colors group-hover:text-primary">{title}</h3>
        <p className="line-clamp-2 text-muted-foreground text-sm leading-relaxed max-w-[90%]">{description}</p>

        {stacks && stacks.length > 0 && (
          <div className="mt-2">
            <TechStacks techStack={stacks} />
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProjectCard;
