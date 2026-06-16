import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { SnippetBaseSchema } from '@xbrk/db/schema';
import { Button } from '@xbrk/ui/button';
import { useAppForm } from '@xbrk/ui/form';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod/v4';
import { SnippetsForm } from '@/components/snippets/form';
import { queryKeys } from '@/lib/query-keys';
import { $createSnippet } from '@/lib/server/snippet';

export const Route = createFileRoute('/(dashboard)/snippets/create')({
  component: SnippetsCreatePage,
  head: () => ({
    meta: [{ title: 'Create Snippet | Dashboard' }],
  }),
});

function SnippetsCreatePage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const createSnippetMutation = useMutation({
    mutationFn: (data: z.infer<typeof SnippetBaseSchema>) => $createSnippet({ data }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.snippet.all });
      toast.success('Snippet created successfully');
      form.reset();
      router.navigate({ to: '/snippets' });
    },
    onError: (_error) => {
      toast.error('Failed to create snippet');
    },
  });

  const handleFormSubmit = (data: z.infer<typeof SnippetBaseSchema>) => {
    createSnippetMutation.mutate(data);
  };

  const form = useAppForm({
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      category: '',
      code: '',
      isDraft: false,
    },
    validators: {
      onChange: SnippetBaseSchema,
    },
    onSubmit: ({ value }) => {
      handleFormSubmit(value);
    },
  });

  return (
    <div className="space-y-6 pb-20">
      <div className="sticky top-16 z-10 -mx-6 mb-6 flex flex-wrap items-center justify-between gap-4 border-b bg-background/95 px-6 py-4 backdrop-blur">
        <div>
          <h2 className="font-bold text-3xl tracking-tight">Create Snippet</h2>
          <p className="text-muted-foreground">Draft a new snippet for your portfolio.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => router.navigate({ to: '/snippets' })} variant="outline">
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
                Create Snippet
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
            <SnippetsForm form={form} />
          </form>
        </form.AppForm>
      </div>
    </div>
  );
}
