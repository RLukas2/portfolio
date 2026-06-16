import { m } from 'framer-motion';
import { Layers } from 'lucide-react';
import type { SimpleIcon } from 'simple-icons';
import Link from '@/components/shared/link';
import { software } from '@/lib/data/uses-data';
import { cn } from '@xbrk/ui';
import { useState, useMemo } from 'react';

const createIconComponent = (icon: SimpleIcon) => (props: React.ComponentProps<'svg'>) => (
  <svg {...props} fill="currentColor" viewBox="0 0 24 24">
    <title>{icon.title}</title>
    <path d={icon.path} />
  </svg>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.4, ease: "circOut" as const },
  },
};

export default function Uses() {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Create mock categories based on data index for demonstration since we don't have category field in simple uses-data
  const categorizedSoftware = useMemo(() => {
     return software.map((s, i) => ({
         ...s,
         category: i % 3 === 0 ? 'Development' : i % 3 === 1 ? 'Design' : 'Productivity'
     }));
  }, []);

  const categories = ['All', 'Development', 'Design', 'Productivity'];

  const filteredSoftware = useMemo(() => {
     if (activeCategory === 'All') return categorizedSoftware;
     return categorizedSoftware.filter(s => s.category === activeCategory);
  }, [categorizedSoftware, activeCategory]);

  return (
    <div className="flex flex-col md:flex-row gap-8 lg:gap-12 pb-24">
      {/* Sticky Category Sidebar */}
      <div className="w-full md:w-48 lg:w-64 shrink-0">
        <div className="md:sticky md:top-32 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-4 md:pb-0 mask-edges md:mask-none scrollbar-hide">
          {categories.map((category) => (
             <button
               key={category}
               onClick={() => setActiveCategory(category)}
               className={cn(
                 "px-4 md:px-6 py-2.5 md:py-3 rounded-full md:rounded-xl whitespace-nowrap font-medium text-sm text-left transition-all duration-300",
                 activeCategory === category
                   ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                   : "bg-background/50 md:bg-transparent backdrop-blur-md md:backdrop-blur-none border border-white/10 md:border-transparent hover:bg-background/80 md:hover:bg-background/50 hover:border-white/20 text-muted-foreground"
               )}
             >
               {category}
             </button>
          ))}
        </div>
      </div>

      {/* Grid of Items */}
      <div className="flex-1 space-y-6">
        <div className="hidden md:flex items-center gap-3 pb-4 border-b border-white/10">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Layers className="h-5 w-5 text-primary" />
          </div>
          <h2 className="font-heading font-semibold text-2xl">{activeCategory} Tools</h2>
        </div>

        <m.div
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          initial="hidden"
          variants={containerVariants}
          key={activeCategory} // re-trigger animation on category change
        >
          {filteredSoftware.map((item) => {
            const Icon = createIconComponent(item.icon);

            return (
              <m.div key={item.name} variants={itemVariants}>
                <Link
                  className="group flex flex-col items-center justify-center gap-4 rounded-2xl border border-white/5 bg-background/40 backdrop-blur-md p-5 transition-all duration-300 hover:border-white/20 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 active:scale-95"
                  rel="noopener noreferrer"
                  target="_blank"
                  to={item.link}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-background border border-white/10 shadow-inner transition-colors group-hover:bg-primary/10 group-hover:border-primary/20">
                    <Icon className="h-7 w-7 text-foreground/80 transition-colors group-hover:text-primary" />
                  </div>
                  <p className="line-clamp-1 text-center font-medium text-sm text-foreground/90 group-hover:text-foreground">{item.name}</p>
                </Link>
              </m.div>
            );
          })}
        </m.div>
      </div>
    </div>
  );
}
