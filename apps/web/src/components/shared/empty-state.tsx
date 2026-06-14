import { m } from 'framer-motion';
import { Frown } from 'lucide-react';

interface EmptyStateProps {
  message: string;
}

/**
 * Empty State Component
 * This component displays an animated message indicating that there is no data available.
 * Uses Framer Motion for smooth fade-in and scale animations.
 */
const EmptyState = ({ message }: EmptyStateProps) => {
  return (
    <m.div
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="my-4 flex flex-col items-center justify-center space-y-3 py-8 animate-in fade-in zoom-in-95 duration-500"
      initial={false}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <m.div
        animate={{ opacity: 1, scale: 1 }}
        initial={false}
        transition={{ duration: 0.4, delay: 0.1, ease: 'backOut' }}
      >
        <Frown className="size-12 text-muted-foreground" />
      </m.div>
      <m.p
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-muted-foreground animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200 fill-mode-both"
        initial={false}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {message}
      </m.p>
    </m.div>
  );
};

export default EmptyState;
