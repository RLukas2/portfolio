import { Marquee } from '@/components/shared/marquee';
import { techStacks } from '@/lib/data/tech-stack';

const firstRowStacks = techStacks.filter((_, index) => index % 2 === 0);
const secondRowStacks = techStacks.filter((_, index) => index % 2 !== 0);
const marqueeRows = [
  { id: 'forward', reverse: false, stacks: firstRowStacks },
  { id: 'reverse', reverse: true, stacks: secondRowStacks },
] as const;

function TechStackBadge({ name, color, path, title }: { name: string; color: string; path: string; title: string }) {
  return (
    <div className="flex items-center gap-3 rounded-full border border-white/5 bg-background/50 backdrop-blur-md px-5 py-2.5 shadow-sm transition-all duration-300 hover:shadow-[0_8px_32px_0_rgba(255,255,255,0.05)] hover:-translate-y-1 hover:border-white/20 hover:bg-background/80 group">
      <svg
        className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
        fill="currentColor"
        role="img"
        style={{ color }}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>{title}</title>
        <path d={path} />
      </svg>
      <span className="font-medium text-sm tracking-tight text-foreground/80 group-hover:text-foreground transition-colors">{name}</span>
    </div>
  );
}

/**
 * TechStacks Component for About Page
 */
export function TechStacks() {
  return (
    <div className="space-y-6 overflow-hidden py-4 mask-edges">
      {marqueeRows.map((row) => (
        <Marquee fade key={`marquee-${row.id}`} pauseOnHover reverse={row.reverse} className="gap-4">
          {row.stacks.map((stack) => (
            <TechStackBadge
              color={stack.color}
              key={stack.name}
              name={stack.name}
              path={stack.icon.path}
              title={stack.icon.title}
            />
          ))}
        </Marquee>
      ))}
    </div>
  );
}
