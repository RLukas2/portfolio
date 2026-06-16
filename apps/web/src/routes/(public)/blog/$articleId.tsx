import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, ErrorComponent, notFound } from '@tanstack/react-router';
import { siteConfig } from '@xbrk/config';
import { RenderedMarkdown } from '@xbrk/md';
import { NotFound } from '@xbrk/ui/not-found';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@xbrk/ui/sheet';
import { calculateReadingTime, formatDate } from '@xbrk/utils';
import { m } from 'framer-motion';
import { List, Tag } from 'lucide-react';
import { Suspense, useEffect, useRef } from 'react';
import SignInModal from '@/components/auth/sign-in-modal';
import ArticleCard from '@/components/blog/article-card';
import ArticleComment from '@/components/blog/article-comment';
import LikeButton from '@/components/blog/like-button';
import TableOfContents from '@/components/blog/toc';
import BreadcrumbNavigation from '@/components/shared/breadcrumb-navigation';
import SocialShare from '@/components/shared/social-share';
import { ArticleContentSkeleton } from '@/components/skeletons/article-content-skeleton';
import { queryKeys } from '@/lib/query-keys';
import { seo } from '@/lib/seo';
import { $getArticleBySlug, $viewArticle } from '@/lib/server';
import { generateStructuredDataGraph, getBlogPostSchemas } from '@/lib/structured-data';
import { getBaseUrl } from '@/lib/utils';

export const Route = createFileRoute('/(public)/blog/$articleId')({
  loader: async ({ params: { articleId }, context: { queryClient } }) => {
    try {
      const data = await queryClient.ensureQueryData({
        queryKey: queryKeys.blog.detail(articleId),
        queryFn: () => $getArticleBySlug({ data: { slug: articleId } }),
      });
      return {
        title: data?.title,
        description: data?.description,
        image: data?.imageUrl,
        author: data?.author?.name,
        slug: data?.slug,
        createdAt: data?.createdAt,
        updatedAt: data?.updatedAt,
      };
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message === 'Article not found' || error.message === 'Article is not public')
      ) {
        throw notFound();
      }
      throw error;
    }
  },
  head: ({ loaderData }) => {
    const seoData = seo({
      title: `${loaderData?.title} | ${siteConfig.title}`,
      description: loaderData?.description,
      keywords: siteConfig.keywords,
      image: loaderData?.image,
      author: loaderData?.author,
      type: 'article',
      url: `${getBaseUrl()}/blog/${loaderData?.slug}`,
      canonical: `${getBaseUrl()}/blog/${loaderData?.slug}`,
    });

    const structuredData = loaderData?.title
      ? generateStructuredDataGraph(
          getBlogPostSchemas({
            title: loaderData.title,
            description: loaderData.description || '',
            image: loaderData.image || `${getBaseUrl()}/images/cover.avif`,
            slug: loaderData.slug || '',
            datePublished: loaderData.createdAt?.toISOString() || new Date().toISOString(),
            dateModified: loaderData.updatedAt?.toISOString() || new Date().toISOString(),
          }),
        )
      : null;

    return {
      meta: seoData.meta,
      links: seoData.links,
      scripts: structuredData
        ? [
            {
              type: 'application/ld+json',
              children: structuredData,
            },
          ]
        : [],
    };
  },
  component: RouteComponent,
  errorComponent: ({ error }) => <ErrorComponent error={error} />,
  notFoundComponent: () => <NotFound>Article not found</NotFound>,
});

function RouteComponent() {
  const { articleId } = Route.useParams();
  const { data: article } = useSuspenseQuery({
    queryKey: queryKeys.blog.detail(articleId),
    queryFn: () => $getArticleBySlug({ data: { slug: articleId } }),
  });

  const queryClient = useQueryClient();
  const viewMutation = useMutation({
    mutationFn: (data: { slug: string }) => $viewArticle({ data }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.blog.all });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const hasViewedRef = useRef(false);
  // biome-ignore lint/correctness/useExhaustiveDependencies: view once per mount
  useEffect(() => {
    if (!articleId) {
      return;
    }
    if (hasViewedRef.current) {
      return;
    }
    hasViewedRef.current = true;

    // Session guard to avoid duplicate increments across navigation's in the same tab
    const sessionKey = `viewed:${articleId}`;
    if (sessionStorage.getItem(sessionKey)) {
      return;
    }
    sessionStorage.setItem(sessionKey, '1');

    viewMutation.mutate({ slug: articleId });
  }, [articleId]);

  if (!article) {
    return null;
  }

  const readingTime = calculateReadingTime(article.content ?? '');

  return (
    <>
      <article className="relative lg:gap-10 xl:grid xl:max-w-6xl xl:grid-cols-[1fr_280px] 2xl:max-w-7xl">
        <div className="w-full min-w-0">
          <m.div animate={{ opacity: 1, y: 0 }} initial={false} transition={{ duration: 0.5 }}>
            <BreadcrumbNavigation pageTitle={article.title} />
          </m.div>

          {/* Immersive Header */}
          <m.div
            animate={{ opacity: 1, y: 0 }}
            className="relative my-8 flex min-h-[40vh] flex-col justify-end overflow-hidden rounded-2xl p-8 sm:p-12"
            initial={false}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Background Image / Gradient */}
            {article.imageUrl ? (
              <>
                <div className="absolute inset-0 -z-20 bg-muted">
                  <img
                    alt={article.title}
                    className="h-full w-full object-cover"
                    height={600}
                    src={article.imageUrl}
                    width={1200}
                  />
                </div>
                {/* Gradient Overlay defined by design system */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/80 to-transparent" />
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-purple-500/10 mix-blend-overlay" />
              </>
            ) : (
              <div className="absolute inset-0 -z-20 bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-purple-500/10" />
            )}

            {/* Simplified Metadata */}
            <div className="mb-4 flex items-center gap-4 text-muted-foreground text-sm">
              {article.createdAt && (
                <time dateTime={article.createdAt.toISOString()}>{formatDate(article.createdAt)}</time>
              )}
              <span>•</span>
              <span>{readingTime} min read</span>
            </div>

            {/* Large Title */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <h1 className="max-w-[20ch] font-heading text-4xl text-foreground leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                {article.title}
              </h1>
              <div className="flex items-center gap-4 sm:shrink-0">
                <LikeButton article={article} />
              </div>
            </div>
          </m.div>

          {/* Article content */}
          <m.div animate={{ opacity: 1, y: 0 }} initial={false} transition={{ duration: 0.5, delay: 0.4 }}>
            <Suspense fallback={<ArticleContentSkeleton />}>
              <article className="prose prose-slate dark:prose-invert mx-auto mt-12 max-w-[70ch] prose-headings:font-heading prose-a:text-primary prose-headings:tracking-tight prose-a:no-underline hover:prose-a:underline">
                <RenderedMarkdown rendering={article.contentRendering} />
              </article>
            </Suspense>
          </m.div>

          {/* Tags and share section */}
          <m.div
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 border-border/50 border-t pt-8"
            initial={false}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <Tag className="size-4 text-muted-foreground" />
                  {article.tags.map((tag: string) => (
                    <span
                      className="inline-flex items-center rounded-full bg-linear-to-r from-violet-500/10 to-fuchsia-500/10 px-3 py-1 font-medium text-foreground text-xs transition-colors hover:from-violet-500/20 hover:to-fuchsia-500/20"
                      key={tag}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <SocialShare
                text={`${article.title} via ${siteConfig.author.handle}`}
                url={`${siteConfig.url}/blog/${articleId}`}
              />
            </div>
          </m.div>

          {/* Comments section */}
          <m.div
            animate={{ opacity: 1, y: 0 }}
            className="mt-12"
            initial={false}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <ArticleComment articleId={article.id} articleSlug={article.slug} />
          </m.div>

          {/* Related Articles section */}
          {article.relatedArticles && article.relatedArticles.length > 0 && (
            <m.div
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 border-border/50 border-t pt-8"
              initial={false}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <h2 className="mb-6 font-bold font-heading text-2xl tracking-tight">Related Posts</h2>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                {article.relatedArticles.map((relatedArticle: Parameters<typeof ArticleCard>[0]['article']) => (
                  <ArticleCard
                    article={{
                      ...relatedArticle,
                      viewCount: relatedArticle.viewCount ?? 0,
                      likesCount: relatedArticle.likesCount ?? 0,
                    }}
                    key={relatedArticle.slug}
                  />
                ))}
              </div>
            </m.div>
          )}
        </div>

        {/* Table of contents - subtle sticky sidebar */}
        {article.toc && (
          <m.div
            animate={{ opacity: 1, x: 0 }}
            className="hidden text-sm opacity-60 transition-opacity hover:opacity-100 xl:block"
            initial={false}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="sticky top-24 pt-8">
              <TableOfContents toc={article.toc} />
            </div>
          </m.div>
        )}

        {/* Mobile Floating ToC Button */}
        {article.toc && (
          <div className="fixed right-6 bottom-6 z-40 xl:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button
                  aria-label="Table of Contents"
                  className="flex size-14 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform hover:scale-105 active:scale-95"
                  type="button"
                >
                  <List className="size-6" />
                </button>
              </SheetTrigger>
              <SheetContent className="max-h-[85vh] rounded-t-2xl pb-8" side="bottom">
                <SheetHeader className="pt-2 pb-4">
                  <SheetTitle className="text-left text-lg">Table of Contents</SheetTitle>
                </SheetHeader>
                <TableOfContents isMobile toc={article.toc} />
              </SheetContent>
            </Sheet>
          </div>
        )}
      </article>
      <SignInModal />
    </>
  );
}
