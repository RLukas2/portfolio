import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { siteConfig } from '@xbrk/config';
import type { UserType } from '@xbrk/types';
import { Skeleton } from '@xbrk/ui/skeleton';
import SignInButton from '@/components/auth/sign-in-button';
import SignInModal from '@/components/auth/sign-in-modal';
import MessageForm from '@/components/guestbook/message-form';
import Messages from '@/components/guestbook/messages';
import PageHeading from '@/components/shared/page-heading';
import { pagesData } from '@/lib/data/pages-data';
import { seoData as seoMetadata } from '@/lib/data/seo-data';
import { queryKeys } from '@/lib/query-keys';
import { seo } from '@/lib/seo';
import { $getAllGuestbookEntries } from '@/lib/server';
import { getBaseUrl } from '@/lib/utils';

export const Route = createFileRoute('/(public)/guestbook/')({
  component: RouteComponent,
  loader: async ({ context: { queryClient, user } }) => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.guestbook.list(),
      queryFn: () => $getAllGuestbookEntries(),
    });
    return { user };
  },
  head: () => {
    const seoData = seo({
      title: `Guestbook | ${siteConfig.title}`,
      description: seoMetadata.guestbook.description,
      keywords: seoMetadata.guestbook.keywords,
      url: `${getBaseUrl()}/guestbook`,
      canonical: `${getBaseUrl()}/guestbook`,
    });
    return {
      meta: seoData.meta,
      links: seoData.links,
    };
  },
});

function GuestbookSkeleton() {
  return (
    <div className="mt-10 flex flex-col gap-6">
      {Array.from({ length: 5 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: valid use case
        <div className="flex gap-3 px-3" key={i}>
          <Skeleton className="size-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-1.5">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-8" />
              <Skeleton className="h-4 w-20" />
            </div>

            <div className="flex min-h-8 items-center gap-4">
              <Skeleton className="h-5 w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function RouteComponent() {
  const {
    data: messages,
    isLoading,
    isFetching,
  } = useSuspenseQuery({
    queryKey: queryKeys.guestbook.list(),
    queryFn: () => $getAllGuestbookEntries(),
  });
  const { user } = Route.useLoaderData();

  return (
    <>
      <PageHeading description={pagesData.guestbook.description} title={pagesData.guestbook.title} />

      {user ? <MessageForm user={user as UserType} /> : <SignInButton />}
      {isLoading || isFetching ? <GuestbookSkeleton /> : <Messages messages={messages} />}
      <SignInModal />
    </>
  );
}
