import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, ErrorComponent, useRouter } from '@tanstack/react-router';
import { ProjectBaseSchema } from '@xbrk/db/schema';
import { Button } from '@xbrk/ui/button';
import { useAppForm } from '@xbrk/ui/form';
import { NotFound } from '@xbrk/ui/not-found';
import { ExternalLink, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod/v4';
import { ProjectsForm } from '@/components/projects/form';
import { env } from '@/lib/env/client';
import { queryKeys } from '@/lib/query-keys';
import { $getProjectById, $updateProject } from '@/lib/server/project';

export const Route = createFileRoute('/(dashboard)/projects/$projectId/edit')({
  component: ProjectsEditPage,
  loader: async ({ params: { projectId }, context: { queryClient } }) => {
    const data = await queryClient.ensureQueryData({
      queryKey: queryKeys.project.byId(projectId),
      queryFn: () => $getProjectById({ data: { id: projectId } }),
    });

    return { title: data?.title };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `Edit Project: ${loaderData?.title} | Dashboard` }],
  }),
  errorComponent: ({ error }) => <ErrorComponent error={error} />,
  notFoundComponent: () => <NotFound>Project not found</NotFound>,
});

function ProjectsEditPage() {
  const { projectId } = Route.useParams();

  const project = useSuspenseQuery({
    queryKey: queryKeys.project.byId(projectId),
    queryFn: () => $getProjectById({ data: { id: projectId } }),
  });

  const router = useRouter();
  const queryClient = useQueryClient();

  const updateProjectMutation = useMutation({
    mutationFn: (data: z.infer<typeof ProjectBaseSchema> & { id: string }) => $updateProject({ data }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.project.all });
      toast.success('Project updated successfully');
      form.reset();
      router.navigate({ to: '/projects' });
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      toast.error(
        `Failed to create project: ${
          errorMessage.includes('validation')
            ? 'Please check your form inputs'
            : 'Server error. Please try again later.'
        }`,
      );
    },
  });

  const handleFormSubmit = (data: z.infer<typeof ProjectBaseSchema>) => {
    updateProjectMutation.mutate({
      ...data,
      id: project.data?.id ?? '',
    });
  };

  const form = useAppForm({
    defaultValues: {
      title: project.data?.title ?? '',
      slug: project.data?.slug ?? '',
      description: project.data?.description ?? '',
      content: project.data?.content ?? '',
      githubUrl: project.data?.githubUrl ?? '',
      demoUrl: project.data?.demoUrl ?? '',
      thumbnail: '',
      isFeatured: project.data?.isFeatured ?? false,
      isDraft: project.data?.isDraft ?? false,
      stacks: project.data?.stacks ?? [],
    },
    validators: {
      onChange: ProjectBaseSchema,
    },
    onSubmit: ({ value }) => {
      handleFormSubmit(value);
    },
  });

  return (
    <div className="space-y-6 pb-20">
      <div className="sticky top-16 z-10 -mx-6 mb-6 flex flex-wrap items-center justify-between gap-4 border-b bg-background/95 px-6 py-4 backdrop-blur">
        <div>
          <h2 className="font-bold text-3xl tracking-tight">Edit Project</h2>
          <p className="text-muted-foreground">Update your existing project details.</p>
        </div>
        <div className="flex items-center gap-2">
          {env.VITE_APP_URL && project.data?.slug && (
            <Button asChild variant="ghost">
              <a href={`${env.VITE_APP_URL}/projects/${project.data.slug}`} rel="noopener noreferrer" target="_blank">
                <ExternalLink className="mr-2 h-4 w-4" />
                View Live
              </a>
            </Button>
          )}
          <Button onClick={() => router.navigate({ to: '/projects' })} variant="outline">
            Cancel
          </Button>
          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <Button
                disabled={!canSubmit}
                onClick={() => {
                  form.handleSubmit();
                }}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            )}
          </form.Subscribe>
        </div>
      </div>
      <div>
        <form.AppForm>
          <form
            className="space-y-8"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <ProjectsForm form={form} project={project.data} />
          </form>
        </form.AppForm>
      </div>
    </div>
  );
}
