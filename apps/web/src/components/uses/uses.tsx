import { m } from 'framer-motion';
import { Layers } from 'lucide-react';
import type { SimpleIcon } from 'simple-icons';
import Link from '@/components/shared/link';
import { software } from '@/lib/data/uses-data';

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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

export default function Uses() {
  return (
    <>
      {/* Left Sticky Visual container */}
      <m.div
        animate={{ opacity: 1, x: 0 }}
        className="sticky top-24 z-10 flex w-full shrink-0 flex-col gap-6 lg:w-[320px]"
        initial={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="glassmorphism flex flex-col gap-4 overflow-hidden rounded-2xl p-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10">
            <Layers className="h-8 w-8 text-primary" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-heading text-2xl text-foreground tracking-tight">Categories</h3>
            <h4 className="text-lg text-muted-foreground">Software & Applications</h4>
          </div>
        </div>
      </m.div>

      {/* Right Content Sections */}
      <div className="flex w-full flex-col gap-16 lg:gap-24">
        <m.section
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
        >
          <m.div
            animate="visible"
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
            initial="hidden"
            variants={containerVariants}
          >
            {software.map((item) => {
              const Icon = createIconComponent(item.icon);

              return (
                <m.div key={item.name} variants={itemVariants}>
                  <Link
                    className="group glassmorphism flex flex-col items-center justify-center gap-4 rounded-2xl p-6 text-center no-underline transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl active:scale-95"
                    rel="noopener noreferrer"
                    target="_blank"
                    to={item.link}
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted/50 transition-colors group-hover:bg-primary/10">
                      <Icon className="h-7 w-7 transition-colors group-hover:text-primary" />
                    </div>
                    <p className="line-clamp-1 font-heading text-lg transition-colors group-hover:text-primary">
                      {item.name}
                    </p>
                  </Link>
                </m.div>
              );
            })}
          </m.div>
        </m.section>
      </div>
    </>
  );
}
