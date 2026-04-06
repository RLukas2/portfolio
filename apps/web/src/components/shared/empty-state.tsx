import { motion } from 'framer-motion';
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
    <motion.div
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="my-4 flex flex-col items-center justify-center space-y-3 py-8"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        initial={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.4, delay: 0.1, ease: 'backOut' }}
      >
        <Frown className="size-12 text-muted-foreground" />
      </motion.div>
      <motion.p
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-muted-foreground"
        initial={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {message}
      </motion.p>
    </motion.div>
  );
};

export default EmptyState;
