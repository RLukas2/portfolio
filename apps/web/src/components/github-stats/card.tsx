import { Skeleton } from '@xbrk/ui/skeleton';
import { ExternalLink } from 'lucide-react';
import Counter from '@/components/shared/counter';

interface StatCardProps {
  card: { title: string; description?: string; link?: string; value?: number };
}

export default function StatCard({ card }: StatCardProps) {
  const { title, description, value, link } = card;

  return (
    <a
      className="group relative flex flex-col overflow-hidden h-full p-6 transition-all duration-300"
      href={link}
      rel="noreferrer"
      target="_blank"
    >
      {/* External link indicator */}
      <div className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 border border-white/5 opacity-0 -translate-x-2 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0">
        <ExternalLink size={14} className="text-muted-foreground group-hover:text-primary" />
      </div>

      <div className="relative">
        <div className="font-heading font-bold text-5xl tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/60 drop-shadow-sm group-hover:from-primary group-hover:to-primary/60 transition-all duration-500">
          {value === undefined ? <Skeleton className="h-12 w-24 rounded-xl" /> : <Counter value={value} />}
        </div>

        <h3 className="mt-4 font-semibold text-foreground/80 tracking-tight text-lg">{title}</h3>
        {description && <p className="mt-1 text-muted-foreground text-sm">{description}</p>}
      </div>
    </a>
  );
}
