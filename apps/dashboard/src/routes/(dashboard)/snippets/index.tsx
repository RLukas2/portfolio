import { ErrorBoundary } from '@sentry/tanstackstart-react';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { cn } from '@xbrk/ui';
import { buttonVariants } from '@xbrk/ui/button';
import { Card } from '@xbrk/ui/card';
import { Skeleton } from '@xbrk/ui/skeleton';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { DataTable } from '@/components/data-table/data-table';
import { snippetColumns } from '@/components/snippets/columns';
import { queryKeys } from '@/lib/query-keys';
import { $deleteSnippet, $getAllSnippets } from '@/lib/server/snippet';

export const Route = createFileRoute('/(dashboard)/snippets/')({
  component: Snippets,
  loader: async ({ context: { queryClient } }) =>
    await queryClient.ensureQueryData({
      queryKey: queryKeys.snippet.listAll(),
      queryFn: () => $getAllSnippets(),
    }),
  head: () => ({
    meta: [{ title: 'Snippets | Dashboard' }, { name: 'description', content: 'Manage your portfolio snippets' }],
  }),
});

function SnippetsLoading() {
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

function SnippetsError() {
  return (
    <Card className="p-6">
      <div className="text-center">
        <h3 className="font-medium text-destructive text-lg">Failed to load snippets</h3>
        <p className="mt-1 text-muted-foreground text-sm">Please try again later.</p>
      </div>
    </Card>
  );
}

function SnippetsContent() {
  const queryClient = useQueryClient();
  const {
    data: snippets,
    error,
    isLoading,
    isFetching,
  } = useSuspenseQuery({
    queryKey: queryKeys.snippet.listAll(),
    queryFn: () => $getAllSnippets(),
  });

  const deleteSnippetMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(ids.map((id) => $deleteSnippet({ data: id })));
    },
    onSuccess: async (_, ids) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.snippet.all });
      toast.success(`Successfully deleted ${ids.length} snippet${ids.length === 1 ? '' : 's'}.`);
    },
    onError: () => {
      toast.error('Failed to delete selected snippets.');
    },
  });

  const bulkActions = [
    {
      label: 'Delete Selected',
      icon: <Trash2 className="mr-2 h-4 w-4" />,
      variant: 'destructive' as const,
      onClick: (selectedRows: typeof snippets) => {
        const ids = selectedRows.map((row) => row.id);
        deleteSnippetMutation.mutate(ids);
      },
    },
  ];

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h3 className="font-medium text-destructive text-lg">Failed to load snippets</h3>
          <p className="mt-1 text-muted-foreground text-sm">{error.message ?? 'Please try again later.'}</p>
        </div>
      </Card>
    );
  }

  if (isLoading || isFetching) {
    return <SnippetsLoading />;
  }

  return <DataTable bulkActions={bulkActions} columns={snippetColumns} data={snippets} entityName="snippets" />;
}

function Snippets() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-3xl tracking-tight">Snippets</h2>
          <p className="text-muted-foreground">Manage and organize your code snippets.</p>
        </div>
        <Link
          aria-label="Add new snippet"
          className={cn(buttonVariants({ variant: 'default' }), 'group')}
          to="/snippets/create"
        >
          <Plus className="mr-2" size={16} /> <span>New Snippet</span>
        </Link>
      </div>
      <ErrorBoundary fallback={<SnippetsError />}>
        <SnippetsContent />
      </ErrorBoundary>
    </div>
  );
}
