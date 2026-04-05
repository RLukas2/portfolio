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
    <div className="flex items-center gap-3 rounded-full border bg-card px-4 py-2 shadow-sm transition-shadow hover:shadow-md">
      <svg
        className="h-5 w-5"
        fill="currentColor"
        role="img"
        style={{ color }}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>{title}</title>
        <path d={path} />
      </svg>
      <span className="font-medium text-sm">{name}</span>
    </div>
  );
}

/**
 * TechStacks Component for About Page
 */
export function TechStacks() {
  return (
    <div className="space-y-4 overflow-hidden">
      {marqueeRows.map((row) => (
        <Marquee fade key={`marquee-${row.id}`} pauseOnHover reverse={row.reverse}>
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
