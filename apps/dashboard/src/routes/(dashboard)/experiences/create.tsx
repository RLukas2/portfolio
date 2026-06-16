import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { ExperienceBaseSchema, ExperienceType, type ExperienceTypeValue } from '@xbrk/db/schema';
import { Button } from '@xbrk/ui/button';
import { useAppForm } from '@xbrk/ui/form';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod/v4';
import { ExperiencesForm } from '@/components/experiences/form';
import { queryKeys } from '@/lib/query-keys';
import { $createExperience } from '@/lib/server/experience';

export const Route = createFileRoute('/(dashboard)/experiences/create')({
  component: ExperiencesCreatePage,
  head: () => ({
    meta: [{ title: 'Create Experience | Dashboard' }],
  }),
});

function ExperiencesCreatePage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const createExperienceMutation = useMutation({
    mutationFn: (data: z.infer<typeof ExperienceBaseSchema>) => $createExperience({ data }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.experience.all,
      });
      toast.success('Experience created successfully');
      form.reset();
      router.navigate({ to: '/experiences' });
    },
    onError: (_error) => {
      toast.error('Failed to create experience');
    },
  });

  const handleFormSubmit = (data: z.infer<typeof ExperienceBaseSchema>) => {
    createExperienceMutation.mutate(data);
  };

  const form = useAppForm({
    defaultValues: {
      title: '',
      institution: '',
      description: '',
      thumbnail: '',
      startDate: '',
      endDate: '',
      url: '',
      type: ExperienceType.WORK as ExperienceTypeValue,
      isDraft: false,
      isOnGoing: false,
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
          <h2 className="font-bold text-3xl tracking-tight">Create Experience</h2>
          <p className="text-muted-foreground">Add a new work or educational experience.</p>
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
                Create Experience
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
            <ExperiencesForm experience={undefined} form={form} />
          </form>
        </form.AppForm>
      </div>
    </div>
  );
}
