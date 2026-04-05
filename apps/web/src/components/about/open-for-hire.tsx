import { cn } from '@xbrk/ui';
import { Button } from '@xbrk/ui/button';

export type HiringStatus = 'off' | 'open' | 'hired';

/**
 * OpenForHire component displays an availability status badge.
 * Supports three states: 'off' (hidden), 'open' (looking for work), and 'hired' (currently working).
 *
 * @param {Object} props - Component props
 * @param {HiringStatus} props.status - The current hiring status
 * @returns {React.ReactNode | null} The availability badge or null if 'off'
 */
const OpenForHire = ({ status }: { status: HiringStatus }): React.ReactNode | null => {
  if (status === 'off') {
    return null;
  }

  const isOpen = status === 'open';

  return (
    <Button
      className={cn(
        'pointer-events-none gap-3 border-none px-3 shadow-none transition-all duration-300',
        isOpen ? 'text-primary' : 'text-muted-foreground',
      )}
      size="sm"
      variant="outline"
    >
      <div className="relative flex size-2">
        {isOpen && (
          <span className="absolute -top-1 -left-1 inline-flex size-4 animate-ping rounded-full bg-[radial-gradient(circle_farthest-side_at_0_100%,#00ccb1,transparent),radial-gradient(circle_farthest-side_at_100%_0,#7b61ff,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#ffc414,transparent),radial-gradient(circle_farthest-side_at_0_0,#1ca0fb,#141316)] opacity-75 transition-colors will-change-transform" />
        )}
        <span
          className={cn('relative inline-flex size-2 rounded-full', isOpen ? 'bg-primary' : 'bg-muted-foreground/50')}
        />
      </div>
      {isOpen ? 'Open for hire' : 'Currently working'}
    </Button>
  );
};

export default OpenForHire;
