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
import { queryKeys } from '@/lib/query-keys';
import { seo } from '@/lib/seo';
import { $getAllGuestbookEntries } from '@/lib/server';
import { getBaseUrl } from '@/lib/utils';
import { cn } from '@xbrk/ui';

export const Route = createFileRoute('/(public)/guestbook/')({
  component: RouteComponent,
  loader: async ({ context: { queryClient, user } }) => {
    await queryClient.ensureQueryData({
      queryKey: queryKeys.guestbook.list(),
      queryFn: () => $getAllGuestbookEntries(),
    });
    return { user };
  },
  head: () => {
    const seoData = seo({
      title: `Guestbook | ${siteConfig.title}`,
      description:
        'Client testimonials and feedback from collaborations. See what others say about working with a professional full-stack developer.',
      keywords:
        'Developer Reviews, Client Testimonials, Web Developer Feedback, Professional References, Collaboration Reviews',
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
    <div className="flex flex-col gap-6 pb-32">
      {Array.from({ length: 5 }).map((_, i) => (
        <div className={cn("flex gap-3", i % 2 === 0 ? "self-start" : "self-end flex-row-reverse")} key={i}>
          <Skeleton className="size-10 rounded-full shrink-0" />
          <div className={cn("flex flex-col gap-2 max-w-[80%]", i % 2 === 0 ? "items-start" : "items-end")}>
            <div className="flex items-center gap-1.5">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-12" />
            </div>
            <Skeleton className={cn("h-16 rounded-2xl", i % 2 === 0 ? "rounded-tl-sm w-[300px]" : "rounded-tr-sm w-[250px]")} />
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
    <div className="relative min-h-[calc(100vh-10rem)] flex flex-col">
      <div className="flex-1 pb-32 pt-8 flex flex-col justify-end">
        <PageHeading description={'A place for you to leave your comments and feedback.'} title={'Guestbook'} />
        {isLoading || isFetching ? <GuestbookSkeleton /> : <Messages messages={messages} />}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30 p-4 pb-6 sm:pb-8 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none">
        <div className="container mx-auto lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl pointer-events-auto">
          <div className="max-w-3xl mx-auto glass-panel p-4 rounded-2xl border border-white/10 shadow-2xl flex items-center justify-center">
            {user ? <MessageForm user={user as UserType} /> : <SignInButton />}
          </div>
        </div>
      </div>

      <SignInModal />
    </div>
  );
}
