import { cn } from '@xbrk/ui';

export function ProjectCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex h-full flex-col overflow-hidden rounded-xl border bg-card sm:rounded-2xl", className)}>
      <div className="relative aspect-[16/10] w-full animate-pulse bg-muted" />
      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="h-6 w-3/4 animate-pulse rounded-md bg-muted" />
        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-5/6 animate-pulse rounded-md bg-muted" />
        </div>
        <div className="mt-auto pt-3 flex gap-2">
          <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
          <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
          <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
        </div>
      </div>
    </div>
  );
}
