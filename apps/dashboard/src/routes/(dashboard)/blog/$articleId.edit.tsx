import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, ErrorComponent, useRouter } from '@tanstack/react-router';
import { ArticleBaseSchema } from '@xbrk/db/schema';
import { Button } from '@xbrk/ui/button';
import { useAppForm } from '@xbrk/ui/form';
import { NotFound } from '@xbrk/ui/not-found';
import { ExternalLink, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod/v4';
import { ArticleForm } from '@/components/blog/form';
import { env } from '@/lib/env/client';
import { queryKeys } from '@/lib/query-keys';
import { $getArticleById, $updateArticle } from '@/lib/server/blog';

export const Route = createFileRoute('/(dashboard)/blog/$articleId/edit')({
  component: ArticlesEditPage,
  loader: async ({ params: { articleId }, context: { queryClient } }) => {
    const data = await queryClient.ensureQueryData({
      queryKey: queryKeys.blog.byId(articleId),
      queryFn: () => $getArticleById({ data: { id: articleId } }),
    });

    return { title: data?.title };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `Edit Article: ${loaderData?.title} | Dashboard` }],
  }),
  errorComponent: ({ error }) => <ErrorComponent error={error} />,
  notFoundComponent: () => <NotFound>Project not found</NotFound>,
});

function ArticlesEditPage() {
  const { articleId } = Route.useParams();

  const article = useSuspenseQuery({
    queryKey: queryKeys.blog.byId(articleId),
    queryFn: () => $getArticleById({ data: { id: articleId } }),
  });

  const router = useRouter();
  const queryClient = useQueryClient();

  const updateArticleMutation = useMutation({
    mutationFn: (data: z.infer<typeof ArticleBaseSchema> & { id: string }) => $updateArticle({ data }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.blog.all });
      toast.success('Article updated successfully');
      form.reset();
      router.navigate({ to: '/blog' });
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      toast.error(
        `Failed to create article: ${
          errorMessage.includes('validation')
            ? 'Please check your form inputs'
            : 'Server error. Please try again later.'
        }`,
      );
    },
  });

  const handleFormSubmit = (data: z.infer<typeof ArticleBaseSchema>) => {
    updateArticleMutation.mutate({
      ...data,
      id: article.data?.id ?? '',
    });
  };

  const form = useAppForm({
    defaultValues: {
      title: article.data?.title ?? '',
      slug: article.data?.slug ?? '',
      description: article.data?.description ?? '',
      content: article.data?.content ?? '',
      thumbnail: '',
      isDraft: article.data?.isDraft ?? false,
      tags: article.data?.tags ?? [],
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
      <div className="sticky top-16 z-10 -mx-6 mb-6 flex flex-wrap items-center justify-between gap-4 border-b bg-background/95 px-6 py-4 backdrop-blur">
        <div>
          <h2 className="font-bold text-3xl tracking-tight">Edit Article</h2>
          <p className="text-muted-foreground">Update your existing blog article.</p>
        </div>
        <div className="flex items-center gap-2">
          {env.VITE_APP_URL && article.data?.slug && (
            <Button asChild variant="ghost">
              <a href={`${env.VITE_APP_URL}/blog/${article.data.slug}`} rel="noopener noreferrer" target="_blank">
                <ExternalLink className="mr-2 h-4 w-4" />
                View Live
              </a>
            </Button>
          )}
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
            <ArticleForm article={article.data} form={form} />
          </form>
        </form.AppForm>
      </div>
    </div>
  );
}
