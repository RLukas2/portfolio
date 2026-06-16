import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, ErrorComponent, useRouter } from '@tanstack/react-router';
import { ExperienceBaseSchema, ExperienceType, type ExperienceTypeValue } from '@xbrk/db/schema';
import { Button } from '@xbrk/ui/button';
import { useAppForm } from '@xbrk/ui/form';
import { NotFound } from '@xbrk/ui/not-found';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod/v4';
import { ExperiencesForm } from '@/components/experiences/form';
import { queryKeys } from '@/lib/query-keys';
import { $getExperienceById, $updateExperience } from '@/lib/server/experience';

export const Route = createFileRoute('/(dashboard)/experiences/$experienceId/edit')({
  component: ExperiencesEditPage,
  loader: async ({ params: { experienceId }, context: { queryClient } }) => {
    const data = await queryClient.ensureQueryData({
      queryKey: queryKeys.experience.byId(experienceId),
      queryFn: () => $getExperienceById({ data: { id: experienceId } }),
    });

    return { title: data?.title };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `Edit Experience: ${loaderData?.title} | Dashboard` }],
  }),
  errorComponent: ({ error }) => <ErrorComponent error={error} />,
  notFoundComponent: () => <NotFound>Project not found</NotFound>,
});

function ExperiencesEditPage() {
  const { experienceId } = Route.useParams();

  const experience = useSuspenseQuery({
    queryKey: queryKeys.experience.byId(experienceId),
    queryFn: () => $getExperienceById({ data: { id: experienceId } }),
  });

  const router = useRouter();
  const queryClient = useQueryClient();

  const updateExperienceMutation = useMutation({
    mutationFn: (data: z.infer<typeof ExperienceBaseSchema> & { id: string }) => $updateExperience({ data }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.experience.all,
      });
      toast.success('Experience updated successfully');
      form.reset();
      router.navigate({ to: '/experiences' });
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      toast.error(
        `Failed to update experience: ${
          errorMessage.includes('validation')
            ? 'Please check your form inputs'
            : 'Server error. Please try again later.'
        }`,
      );
    },
  });

  const handleFormSubmit = (data: z.infer<typeof ExperienceBaseSchema>) => {
    updateExperienceMutation.mutate({
      ...data,
      id: experience.data?.id ?? '',
    });
  };

  const form = useAppForm({
    defaultValues: {
      title: experience.data?.title ?? '',
      description: experience.data?.description ?? '',
      startDate: experience.data?.startDate ?? '',
      endDate: experience.data?.endDate ?? '',
      institution: experience.data?.institution ?? '',
      url: experience.data?.url ?? '',
      type: (experience.data?.type ?? ExperienceType.WORK) as ExperienceTypeValue,
      thumbnail: '',
      isDraft: experience.data?.isDraft ?? false,
      isOnGoing: experience.data?.isOnGoing ?? false,
    },
    validators: {
      onChange: ExperienceBaseSchema,
    },
    onSubmit: ({ value }) => {
      handleFormSubmit(value);
    },
  });

  return (
    <div className="space-y-6 pb-20">
      <div className="sticky top-16 z-10 -mx-6 mb-6 flex flex-wrap items-center justify-between gap-4 border-b bg-background/95 px-6 py-4 backdrop-blur">
        <div>
          <h2 className="font-bold text-3xl tracking-tight">Edit Experience</h2>
          <p className="text-muted-foreground">Update your existing experience details.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => router.navigate({ to: '/experiences' })} variant="outline">
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
            <ExperiencesForm experience={experience.data} form={form} />
          </form>
        </form.AppForm>
      </div>
    </div>
  );
}
