import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { ProjectBaseSchema } from '@xbrk/db/schema';
import { Button } from '@xbrk/ui/button';
import { useAppForm } from '@xbrk/ui/form';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod/v4';
import { ProjectsForm } from '@/components/projects/form';
import { queryKeys } from '@/lib/query-keys';
import { $createProject } from '@/lib/server/project';

export const Route = createFileRoute('/(dashboard)/projects/create')({
  component: ProjectsCreatePage,
  head: () => ({
    meta: [{ title: 'Create Project | Dashboard' }],
  }),
});

function ProjectsCreatePage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const createProjectMutation = useMutation({
    mutationFn: (data: z.infer<typeof ProjectBaseSchema>) => $createProject({ data }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.project.all });
      toast.success('Project created successfully');
      form.reset();
      router.navigate({ to: '/projects' });
    },
    onError: (_error) => {
      toast.error('Failed to create project');
    },
  });

  const handleFormSubmit = (data: z.infer<typeof ProjectBaseSchema>) => {
    createProjectMutation.mutate(data);
  };

  const form = useAppForm({
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      content: '',
      githubUrl: '',
      demoUrl: '',
      thumbnail: '',
      isFeatured: false,
      isDraft: false,
      stacks: [] as string[],
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
          <h2 className="font-bold text-3xl tracking-tight">Create Project</h2>
          <p className="text-muted-foreground">Set up a new project for your portfolio.</p>
        </div>
        <div className="flex items-center gap-2">
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
                Create Project
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
            <ProjectsForm form={form} project={undefined} />
          </form>
        </form.AppForm>
      </div>
    </div>
  );
}
