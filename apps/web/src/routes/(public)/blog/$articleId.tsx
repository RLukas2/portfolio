import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, ErrorComponent, notFound } from '@tanstack/react-router';
import { siteConfig } from '@xbrk/config';
import { ErrorCodes, isHttpError } from '@xbrk/errors';
import { RenderedMarkdown } from '@xbrk/md';
import { NotFound } from '@xbrk/ui/not-found';
import { m } from 'framer-motion';
import { Suspense } from 'react';
import SignInModal from '@/components/auth/sign-in-modal';
import ArticleComment from '@/components/blog/article-comment';
import ArticleHero from '@/components/blog/article-hero';
import ArticleMobileToc from '@/components/blog/article-mobile-toc';
import ArticleRelated from '@/components/blog/article-related';
import ArticleTagsShare from '@/components/blog/article-tags-share';
import TableOfContents from '@/components/blog/toc';
import BreadcrumbNavigation from '@/components/shared/breadcrumb-navigation';
import { ArticleContentSkeleton } from '@/components/skeletons/article-content-skeleton';
import { useTrackView } from '@/hooks/use-track-view';
import { queryKeys } from '@/lib/query-keys';
import { seo } from '@/lib/seo';
import { $getArticleBySlug } from '@/lib/server';
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
      if (isHttpError(error) && error.code === ErrorCodes.NOT_FOUND) {
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

  useTrackView(articleId);

  if (!article) {
    return null;
  }

  return (
    <>
      <article className="relative xl:max-w-6xl 2xl:max-w-7xl">
        <div className="w-full min-w-0">
          <m.div animate={{ opacity: 1, y: 0 }} initial={false} transition={{ duration: 0.5 }}>
            <BreadcrumbNavigation pageTitle={article.title} />
          </m.div>

          {/* Hero Section */}
          <m.div
            animate={{ opacity: 1, y: 0 }}
            className="relative"
            initial={false}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <ArticleHero article={article} />
          </m.div>
        </div>

        <div className="relative mt-8 lg:gap-10 xl:grid xl:grid-cols-[1fr_280px]">
          <div className="w-full min-w-0">
            {/* Article content */}
            <m.div animate={{ opacity: 1, y: 0 }} initial={false} transition={{ duration: 0.5, delay: 0.4 }}>
              <Suspense fallback={<ArticleContentSkeleton />}>
                <article className="prose prose-slate dark:prose-invert max-w-none! prose-headings:font-heading prose-a:text-violet-600 prose-headings:tracking-tight prose-a:no-underline hover:prose-a:text-violet-500 dark:prose-a:text-violet-400 dark:hover:prose-a:text-violet-300">
                  <RenderedMarkdown rendering={article.contentRendering} />
                </article>
              </Suspense>
            </m.div>
          </div>

          {/* Table of contents - enhanced sticky sidebar */}
          {article.toc && (
            <m.div
              animate={{ opacity: 1, x: 0 }}
              className="hidden text-sm xl:block"
              initial={false}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="sticky top-20">
                <TableOfContents toc={article.toc} />
              </div>
            </m.div>
          )}
        </div>

        {/* Tags and share section */}
        <m.div
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 border-border/50 border-t pt-8"
          initial={false}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <ArticleTagsShare slug={articleId} tags={article.tags} title={article.title} />
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
            <ArticleRelated relatedArticles={article.relatedArticles} />
          </m.div>
        )}

        {/* Mobile Floating ToC Button */}
        <ArticleMobileToc toc={article.toc} />
      </article>
      <SignInModal />
    </>
  );
}
