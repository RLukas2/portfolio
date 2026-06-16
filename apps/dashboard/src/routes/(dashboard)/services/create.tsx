import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { ServiceBaseSchema } from '@xbrk/db/schema';
import { Button } from '@xbrk/ui/button';
import { useAppForm } from '@xbrk/ui/form';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod/v4';
import { ServicesForm } from '@/components/services/form';
import { queryKeys } from '@/lib/query-keys';
import { $createService } from '@/lib/server/service';

export const Route = createFileRoute('/(dashboard)/services/create')({
  component: ServicesCreatePage,
  head: () => ({
    meta: [{ title: 'Create Service | Dashboard' }],
  }),
});

function ServicesCreatePage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const createServiceMutation = useMutation({
    mutationFn: (data: z.infer<typeof ServiceBaseSchema>) => $createService({ data }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.service.all });
      toast.success('Service created successfully');
      form.reset();
      router.navigate({ to: '/services' });
    },
    onError: (_error) => {
      toast.error('Failed to create service');
    },
  });

  const handleFormSubmit = (data: z.infer<typeof ServiceBaseSchema>) => {
    createServiceMutation.mutate(data);
  };

  const form = useAppForm({
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      content: '',
      thumbnail: '',
      isDraft: false,
      stacks: [] as string[],
    },
    validators: {
      onChange: ServiceBaseSchema,
    },
    onSubmit: ({ value }) => {
      handleFormSubmit(value);
    },
  });

  return (
    <div className="space-y-6 pb-20">
      <div className="sticky top-16 z-10 -mx-6 mb-6 flex flex-wrap items-center justify-between gap-4 border-b bg-background/95 px-6 py-4 backdrop-blur">
        <div>
          <h2 className="font-bold text-3xl tracking-tight">Create Service</h2>
          <p className="text-muted-foreground">Set up a new service for your portfolio.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => router.navigate({ to: '/services' })} variant="outline">
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
                Create Service
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
            <ServicesForm form={form} service={undefined} />
          </form>
        </form.AppForm>
      </div>
    </div>
  );
}
