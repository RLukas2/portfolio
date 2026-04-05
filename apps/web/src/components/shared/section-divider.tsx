import { cn } from '@xbrk/ui';

interface SectionDividerProps {
  className?: string;
}

const SectionDivider = ({ className }: SectionDividerProps) => {
  return (
    <div className={cn('relative my-12 w-full', className)}>
      <div aria-hidden="true" className="absolute inset-0 flex items-center">
        <div className="w-full border-border border-t" />
      </div>
      <div className="relative flex justify-center">
        <div className="bg-background px-4">
          <div className="flex gap-1.5">
            <span className="size-1.5 rounded-full bg-primary" />
            <span className="size-1.5 rounded-full bg-primary/60" />
            <span className="size-1.5 rounded-full bg-primary/30" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionDivider;
