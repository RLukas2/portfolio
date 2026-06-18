import { ErrorBoundary } from '@sentry/tanstackstart-react';
import { type QueryKey, useSuspenseQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { type ColumnDef } from '@tanstack/react-table';
import { cn } from '@xbrk/ui';
import { buttonVariants } from '@xbrk/ui/button';
import { Card } from '@xbrk/ui/card';
import { Skeleton } from '@xbrk/ui/skeleton';
import { Plus } from 'lucide-react';
import { Suspense } from 'react';
import { DataTable } from '@/components/data-table/data-table';

interface ResourceListPageProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  createLabel: string;
  createTo: string;
  description: string;
  entityName: string;
  errorTitle: string;
  queryFn: () => Promise<TData[]>;
  queryKey: QueryKey;
  title: string;
}

function ResourceListLoading() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-8 w-[250px]" />
      <Skeleton className="h-4 w-[350px]" />
      <div className="mt-6">
        <Skeleton className="h-[400px] w-full rounded-md" />
      </div>
    </div>
  );
}

function ResourceListError({ title }: Readonly<{ title: string }>) {
  return (
    <Card className="p-6">
      <div className="text-center">
        <h3 className="font-medium text-destructive text-lg">{title}</h3>
        <p className="mt-1 text-muted-foreground text-sm">Please try again later.</p>
      </div>
    </Card>
  );
}

function ResourceListContent<TData, TValue>({
  columns,
  entityName,
  queryFn,
  queryKey,
}: Readonly<Pick<ResourceListPageProps<TData, TValue>, 'columns' | 'entityName' | 'queryFn' | 'queryKey'>>) {
  const { data } = useSuspenseQuery({
    queryKey,
    queryFn,
  });

  return <DataTable columns={columns} data={data} entityName={entityName} />;
}

export function ResourceListPage<TData, TValue>({
  columns,
  createLabel,
  createTo,
  description,
  entityName,
  errorTitle,
  queryFn,
  queryKey,
  title,
}: Readonly<ResourceListPageProps<TData, TValue>>) {
  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-2xl tracking-tight">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <Link aria-label={createLabel} className={cn(buttonVariants({ variant: 'default' }), 'group')} to={createTo}>
          <span>{createLabel}</span> <Plus className="ml-1" size={18} />
        </Link>
      </div>
      <ErrorBoundary fallback={<ResourceListError title={errorTitle} />}>
        <Suspense fallback={<ResourceListLoading />}>
          <ResourceListContent columns={columns} entityName={entityName} queryFn={queryFn} queryKey={queryKey} />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
