import { cn } from '@xbrk/ui';

export function ArticleCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('flex h-full flex-col overflow-hidden rounded-xl border bg-card sm:rounded-2xl', className)}>
      <div className="relative aspect-[16/9] w-full animate-pulse bg-muted" />
      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="flex gap-2">
          <div className="h-5 w-20 animate-pulse rounded-md bg-muted" />
          <div className="h-5 w-24 animate-pulse rounded-md bg-muted" />
        </div>
        <div className="h-6 w-full animate-pulse rounded-md bg-muted" />
        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-4/5 animate-pulse rounded-md bg-muted" />
        </div>
        <div className="mt-auto flex items-center justify-between pt-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
            <div className="h-4 w-20 animate-pulse rounded-md bg-muted" />
          </div>
          <div className="h-4 w-16 animate-pulse rounded-md bg-muted" />
        </div>
      </div>
    </div>
  );
}
