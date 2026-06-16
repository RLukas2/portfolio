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
import { experienceColumns } from '@/components/experiences/columns';
import { queryKeys } from '@/lib/query-keys';
import { $deleteExperience, $getAllExperiences } from '@/lib/server/experience';

export const Route = createFileRoute('/(dashboard)/experiences/')({
  component: Experiences,
  loader: async ({ context: { queryClient } }) =>
    await queryClient.ensureQueryData({
      queryKey: queryKeys.experience.listAll(),
      queryFn: () => $getAllExperiences(),
    }),
  head: () => ({
    meta: [{ title: 'Experiences | Dashboard' }, { name: 'description', content: 'Manage your portfolio experiences' }],
  }),
});

function ExperiencesLoading() {
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

function ExperiencesError() {
  return (
    <Card className="p-6">
      <div className="text-center">
        <h3 className="font-medium text-destructive text-lg">Failed to load experiences</h3>
        <p className="mt-1 text-muted-foreground text-sm">Please try again later.</p>
      </div>
    </Card>
  );
}

function ExperiencesContent() {
  const queryClient = useQueryClient();
  const {
    data: experiences,
    error,
    isLoading,
    isFetching,
  } = useSuspenseQuery({
    queryKey: queryKeys.experience.listAll(),
    queryFn: () => $getAllExperiences(),
  });

  const deleteExperienceMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(ids.map((id) => $deleteExperience({ data: id })));
    },
    onSuccess: async (_, ids) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.experience.all });
      toast.success(`Successfully deleted ${ids.length} experience${ids.length === 1 ? '' : 's'}.`);
    },
    onError: () => {
      toast.error('Failed to delete selected experiences.');
    },
  });

  const bulkActions = [
    {
      label: 'Delete Selected',
      icon: <Trash2 className="mr-2 h-4 w-4" />,
      variant: 'destructive' as const,
      onClick: (selectedRows: typeof experiences) => {
        const ids = selectedRows.map((row) => row.id);
        deleteExperienceMutation.mutate(ids);
      },
    },
  ];

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h3 className="font-medium text-destructive text-lg">Failed to load experiences</h3>
          <p className="mt-1 text-muted-foreground text-sm">{error.message ?? 'Please try again later.'}</p>
        </div>
      </Card>
    );
  }

  if (isLoading || isFetching) {
    return <ExperiencesLoading />;
  }

  return (
    <DataTable bulkActions={bulkActions} columns={experienceColumns} data={experiences} entityName="experiences" />
  );
}

function Experiences() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-3xl tracking-tight">Experiences</h2>
          <p className="text-muted-foreground">Manage and organize your work experiences.</p>
        </div>
        <Link
          aria-label="Add new experience"
          className={cn(buttonVariants({ variant: 'default' }), 'group')}
          to="/experiences/create"
        >
          <Plus className="mr-2" size={16} /> <span>New Experience</span>
        </Link>
      </div>
      <ErrorBoundary fallback={<ExperiencesError />}>
        <ExperiencesContent />
      </ErrorBoundary>
    </div>
  );
}
