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
import { serviceColumns } from '@/components/services/columns';
import { queryKeys } from '@/lib/query-keys';
import { $deleteService, $getAllServices } from '@/lib/server/service';

export const Route = createFileRoute('/(dashboard)/services/')({
  component: Services,
  loader: async ({ context: { queryClient } }) =>
    await queryClient.ensureQueryData({
      queryKey: queryKeys.service.listAll(),
      queryFn: () => $getAllServices(),
    }),
  head: () => ({
    meta: [{ title: 'Services | Dashboard' }, { name: 'description', content: 'Manage your portfolio services' }],
  }),
});

function ServicesLoading() {
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

function ServicesError() {
  return (
    <Card className="p-6">
      <div className="text-center">
        <h3 className="font-medium text-destructive text-lg">Failed to load services</h3>
        <p className="mt-1 text-muted-foreground text-sm">Please try again later.</p>
      </div>
    </Card>
  );
}

function ServicesContent() {
  const queryClient = useQueryClient();
  const {
    data: services,
    error,
    isLoading,
    isFetching,
  } = useSuspenseQuery({
    queryKey: queryKeys.service.listAll(),
    queryFn: () => $getAllServices(),
  });

  const deleteServiceMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(ids.map((id) => $deleteService({ data: id })));
    },
    onSuccess: async (_, ids) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.service.all });
      toast.success(`Successfully deleted ${ids.length} service${ids.length === 1 ? '' : 's'}.`);
    },
    onError: () => {
      toast.error('Failed to delete selected services.');
    },
  });

  const bulkActions = [
    {
      label: 'Delete Selected',
      icon: <Trash2 className="mr-2 h-4 w-4" />,
      variant: 'destructive' as const,
      onClick: (selectedRows: typeof services) => {
        const ids = selectedRows.map((row) => row.id);
        deleteServiceMutation.mutate(ids);
      },
    },
  ];

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h3 className="font-medium text-destructive text-lg">Failed to load services</h3>
          <p className="mt-1 text-muted-foreground text-sm">{error.message ?? 'Please try again later.'}</p>
        </div>
      </Card>
    );
  }

  if (isLoading || isFetching) {
    return <ServicesLoading />;
  }

  return <DataTable bulkActions={bulkActions} columns={serviceColumns} data={services} entityName="services" />;
}

function Services() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-3xl tracking-tight">Services</h2>
          <p className="text-muted-foreground">Manage and organize your portfolio services.</p>
        </div>
        <Link
          aria-label="Add new service"
          className={cn(buttonVariants({ variant: 'default' }), 'group')}
          to="/services/create"
        >
          <Plus className="mr-2" size={16} /> <span>New Service</span>
        </Link>
      </div>
      <ErrorBoundary fallback={<ServicesError />}>
        <ServicesContent />
      </ErrorBoundary>
    </div>
  );
}
