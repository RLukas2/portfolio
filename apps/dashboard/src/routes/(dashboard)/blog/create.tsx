import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { ArticleBaseSchema } from '@xbrk/db/schema';
import { Button } from '@xbrk/ui/button';
import { useAppForm } from '@xbrk/ui/form';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod/v4';
import { ArticleForm } from '@/components/blog/form';
import authClient from '@/lib/auth/client';
import { queryKeys } from '@/lib/query-keys';
import { $createArticle } from '@/lib/server/blog';

export const Route = createFileRoute('/(dashboard)/blog/create')({
  component: ArticlesCreatePage,
  head: () => ({
    meta: [{ title: 'Create Article | Dashboard' }],
  }),
});

function ArticlesCreatePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();

  const createArticleMutation = useMutation({
    mutationFn: (data: z.infer<typeof ArticleBaseSchema> & { authorId: string }) => $createArticle({ data }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.blog.all });
      toast.success('Article created successfully');
      form.reset();
      router.navigate({ to: '/blog' });
    },
    onError: (_error) => {
      toast.error('Failed to create article');
    },
  });

  const handleFormSubmit = (data: z.infer<typeof ArticleBaseSchema>) => {
    createArticleMutation.mutate({
      ...data,
      authorId: session?.user?.id ?? '',
    });
  };

  const form = useAppForm({
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      content: '',
      thumbnail: '',
      isDraft: false,
      tags: [] as string[],
    },
    validators: {
      onChange: ArticleBaseSchema,
    },
    onSubmit: ({ value }) => {
      handleFormSubmit(value);
    },
  });

  return (
    <div className="space-y-6 pb-20">
      <div className="sticky top-16 z-10 mb-6 flex flex-wrap items-center justify-between gap-4 border-b bg-background/95 py-4 backdrop-blur">
        <div>
          <h2 className="font-bold text-3xl tracking-tight">Create Article</h2>
          <p className="text-muted-foreground">Draft a new article for your blog.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => router.navigate({ to: '/blog' })} variant="outline">
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
                Create Article
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
            <ArticleForm article={undefined} form={form} />
          </form>
        </form.AppForm>
      </div>
    </div>
  );
}
