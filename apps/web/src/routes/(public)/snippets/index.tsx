import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { siteConfig } from '@xbrk/config';
import { Skeleton } from '@xbrk/ui/skeleton';
import PageHeading from '@/components/shared/page-heading';
import Snippets from '@/components/snippets';
import { pagesData } from '@/lib/data/pages-data';
import { queryKeys } from '@/lib/query-keys';
import { seo } from '@/lib/seo';
import { $getAllPublicSnippets } from '@/lib/server';
import { getBaseUrl } from '@/lib/utils';

export const Route = createFileRoute('/(public)/snippets/')({
  component: RouteComponent,
  loader: async ({ context: { queryClient } }) =>
    await queryClient.prefetchQuery({
      queryKey: queryKeys.snippet.listPublic(),
      queryFn: () => $getAllPublicSnippets(),
    }),
  head: () => {
    const seoData = seo({
      title: `Snippets | ${siteConfig.title}`,
      description: pagesData.snippets.description,
      keywords: siteConfig.keywords,
      url: `${getBaseUrl()}/snippets`,
      canonical: `${getBaseUrl()}/snippets`,
    });
    return {
      meta: seoData.meta,
      links: seoData.links,
    };
  },
});

function SnippetsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
      <Skeleton className="h-[400px] w-full rounded-md" />
      <Skeleton className="h-[400px] w-full rounded-md" />
      <Skeleton className="h-[400px] w-full rounded-md" />
      <Skeleton className="h-[400px] w-full rounded-md" />
    </div>
  );
}

function RouteComponent() {
  const {
    data: snippets,
    isLoading,
    isFetching,
  } = useSuspenseQuery({
    queryKey: queryKeys.snippet.listPublic(),
    queryFn: () => $getAllPublicSnippets(),
  });

  return (
    <>
      <PageHeading description={pagesData.snippets.description} title={pagesData.snippets.title} />
      {isLoading || isFetching ? <SnippetsSkeleton /> : <Snippets snippets={snippets} />}
    </>
  );
}
