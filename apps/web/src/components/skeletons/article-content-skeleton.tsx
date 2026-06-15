import { cn } from '@xbrk/ui';

export function ArticleContentSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('mt-8 space-y-6', className)}>
      <div className="space-y-3">
        <div className="h-6 w-full animate-pulse rounded-md bg-muted" />
        <div className="h-6 w-[90%] animate-pulse rounded-md bg-muted" />
        <div className="h-6 w-[95%] animate-pulse rounded-md bg-muted" />
        <div className="h-6 w-[85%] animate-pulse rounded-md bg-muted" />
      </div>

      <div className="space-y-3 pt-6">
        <div className="h-8 w-[40%] animate-pulse rounded-md bg-muted" />
        <div className="h-6 w-full animate-pulse rounded-md bg-muted" />
        <div className="h-6 w-[92%] animate-pulse rounded-md bg-muted" />
        <div className="h-6 w-[88%] animate-pulse rounded-md bg-muted" />
      </div>

      <div className="my-8 h-64 w-full animate-pulse rounded-xl bg-muted" />

      <div className="space-y-3">
        <div className="h-6 w-full animate-pulse rounded-md bg-muted" />
        <div className="h-6 w-[94%] animate-pulse rounded-md bg-muted" />
        <div className="h-6 w-[80%] animate-pulse rounded-md bg-muted" />
      </div>
    </div>
  );
}
