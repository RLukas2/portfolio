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
import { projectColumns } from '@/components/projects/columns';
import { queryKeys } from '@/lib/query-keys';
import { $deleteProject, $getAllProjects } from '@/lib/server/project';

export const Route = createFileRoute('/(dashboard)/projects/')({
  component: Projects,
  loader: async ({ context: { queryClient } }) =>
    await queryClient.ensureQueryData({
      queryKey: queryKeys.project.listAll(),
      queryFn: () => $getAllProjects(),
    }),
  head: () => ({
    meta: [{ title: 'Projects | Dashboard' }, { name: 'description', content: 'Manage your portfolio projects' }],
  }),
});

function ProjectsLoading() {
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

function ProjectsError() {
  return (
    <Card className="p-6">
      <div className="text-center">
        <h3 className="font-medium text-destructive text-lg">Failed to load projects</h3>
        <p className="mt-1 text-muted-foreground text-sm">Please try again later.</p>
      </div>
    </Card>
  );
}

function ProjectsContent() {
  const queryClient = useQueryClient();
  const {
    data: projects,
    error,
    isLoading,
    isFetching,
  } = useSuspenseQuery({
    queryKey: queryKeys.project.listAll(),
    queryFn: () => $getAllProjects(),
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      // Execute deletions sequentially or in parallel. We'll do parallel.
      await Promise.all(ids.map((id) => $deleteProject({ data: id })));
    },
    onSuccess: async (_, ids) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.project.all });
      toast.success(`Successfully deleted ${ids.length} project${ids.length === 1 ? '' : 's'}.`);
    },
    onError: () => {
      toast.error('Failed to delete selected projects.');
    },
  });

  const bulkActions = [
    {
      label: 'Delete Selected',
      icon: <Trash2 className="mr-2 h-4 w-4" />,
      variant: 'destructive' as const,
      onClick: (selectedRows: typeof projects) => {
        const ids = selectedRows.map((row) => row.id);
        deleteProjectMutation.mutate(ids);
      },
    },
  ];

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h3 className="font-medium text-destructive text-lg">Failed to load projects</h3>
          <p className="mt-1 text-muted-foreground text-sm">{error.message ?? 'Please try again later.'}</p>
        </div>
      </Card>
    );
  }

  if (isLoading || isFetching) {
    return <ProjectsLoading />;
  }

  return <DataTable bulkActions={bulkActions} columns={projectColumns} data={projects} entityName="projects" />;
}

function Projects() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-3xl tracking-tight">Projects</h2>
          <p className="text-muted-foreground">Manage and organize your portfolio projects.</p>
        </div>
        <Link
          aria-label="Add new project"
          className={cn(buttonVariants({ variant: 'default' }), 'group')}
          to="/projects/create"
        >
          <Plus className="mr-2" size={16} /> <span>New Project</span>
        </Link>
      </div>
      <ErrorBoundary fallback={<ProjectsError />}>
        <ProjectsContent />
      </ErrorBoundary>
    </div>
  );
}
