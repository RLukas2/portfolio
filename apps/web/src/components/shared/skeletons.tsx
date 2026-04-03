import { Skeleton } from '@xbrk/ui/skeleton';

export function ArticleCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border bg-card">
      <Skeleton className="aspect-16/10 w-full" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="mt-auto flex items-center gap-4 border-t pt-4">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border bg-card sm:rounded-2xl">
      <Skeleton className="aspect-16/10 w-full" />
      <div className="flex flex-1 flex-col gap-2 p-4 sm:gap-3 sm:p-5">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="mt-auto flex gap-2 pt-3">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function MessageSkeleton() {
  return (
    <div className="flex gap-4 rounded-xl p-4">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}

export function CommentSkeleton() {
  return (
    <div className="flex gap-2 p-2 sm:px-4">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-16 w-full rounded-lg" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    </div>
  );
}

export function PageHeadingSkeleton() {
  return (
    <div className="mb-10 space-y-3">
      <Skeleton className="h-10 w-64 md:h-12" />
      <Skeleton className="h-5 w-full max-w-2xl" />
      <Skeleton className="h-5 w-3/4 max-w-xl" />
    </div>
  );
}

export function ArticleListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {Array.from({ length: 4 }, (_, i) => `article-skeleton-${i}`).map((key) => (
        <ArticleCardSkeleton key={key} />
      ))}
    </div>
  );
}

export function ProjectListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
      {Array.from({ length: 4 }, (_, i) => `project-skeleton-${i}`).map((key) => (
        <ProjectCardSkeleton key={key} />
      ))}
    </div>
  );
}

export function MessageListSkeleton() {
  return (
    <div className="mt-8 space-y-2">
      {Array.from({ length: 5 }, (_, i) => `message-skeleton-${i}`).map((key) => (
        <MessageSkeleton key={key} />
      ))}
    </div>
  );
}

export function CommentListSkeleton() {
  return (
    <div className="space-y-2 rounded-lg border py-2 dark:bg-zinc-900/30">
      {Array.from({ length: 3 }, (_, i) => `comment-skeleton-${i}`).map((key) => (
        <CommentSkeleton key={key} />
      ))}
    </div>
  );
}
