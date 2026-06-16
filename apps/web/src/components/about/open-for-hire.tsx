import { cn } from '@xbrk/ui';

export type HiringStatus = 'off' | 'open' | 'hired';

/**
 * OpenForHire component displays an availability status badge.
 * Supports three states: 'off' (hidden), 'open' (looking for work), and 'hired' (currently working).
 */
const OpenForHire = ({ status }: { status: HiringStatus }): React.ReactNode | null => {
  if (status === 'off') {
    return null;
  }

  const isOpen = status === 'open';

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-white/5 bg-background/30 backdrop-blur-md px-4 py-1.5 font-medium text-sm transition-all duration-300 w-full sm:w-auto justify-center',
        isOpen ? 'text-primary border-primary/20 bg-primary/5' : 'text-muted-foreground',
      )}
    >
      <div className="relative flex size-2">
        {isOpen && (
          <span className="absolute -inset-1 inline-flex size-4 animate-ping rounded-full bg-green-400 opacity-75" />
        )}
        <span
          className={cn('relative inline-flex size-2 rounded-full', isOpen ? 'bg-green-500' : 'bg-muted-foreground')}
        />
      </div>
      {isOpen ? 'Available for new opportunities' : 'Currently engaged'}
    </div>
  );
};

export default OpenForHire;
