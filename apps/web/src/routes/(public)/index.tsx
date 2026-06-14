import { createFileRoute } from '@tanstack/react-router';
import { siteConfig } from '@xbrk/config';
import { Suspense } from 'react';
import ConnectSection from '@/components/home/connect-section';
import FeaturedProjects from '@/components/home/featured-projects';
import PersonalHero from '@/components/home/personal-hero';
import RecentPosts from '@/components/home/recent-posts';
import SectionDivider from '@/components/shared/section-divider';
import { ArticleCardSkeleton } from '@/components/skeletons/article-card-skeleton';
import { ProjectCardSkeleton } from '@/components/skeletons/project-card-skeleton';
import { queryKeys } from '@/lib/query-keys';
import { seo } from '@/lib/seo';
import { $getAllPublicArticles, $getAllPublicProjects } from '@/lib/server';
import { generateStructuredDataGraph, getHomepageSchemas } from '@/lib/structured-data';
import { getBaseUrl } from '@/lib/utils';

export const Route = createFileRoute('/(public)/')({
  component: Home,
  loader: async ({ context: { queryClient } }) => {
    // Prefetch both projects and articles data for the home page
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: queryKeys.project.listPublic(),
        queryFn: () => $getAllPublicProjects(),
      }),
      queryClient.prefetchQuery({
        queryKey: queryKeys.blog.listPublic(),
        queryFn: () => $getAllPublicArticles(),
      }),
    ]);
  },
  head: () => {
    const seoData = seo({
      title: siteConfig.title,
      description: siteConfig.description,
      keywords: siteConfig.keywords,
      url: getBaseUrl(),
      canonical: getBaseUrl(),
    });
    const structuredData = generateStructuredDataGraph(getHomepageSchemas());

    return {
      meta: seoData.meta,
      links: seoData.links,
      scripts: [
        {
          type: 'application/ld+json',
          children: structuredData,
        },
      ],
    };
  },
});

function Home() {
  return (
    <>
      <PersonalHero />

      <div className="flex flex-col items-center gap-8">
        <Suspense fallback={
          <div className="w-full">
            <div className="my-8 flex flex-col items-center px-1 py-4 text-center sm:mb-10">
              <div className="mb-3 h-5 w-24 animate-pulse rounded-md bg-muted" />
              <div className="h-10 w-64 animate-pulse rounded-md bg-muted" />
              <div className="mt-3 h-6 w-96 max-w-full animate-pulse rounded-md bg-muted" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
              {[1, 2, 3, 4].map((i) => (
                <ProjectCardSkeleton key={i} />
              ))}
            </div>
          </div>
        }>
          <FeaturedProjects />
        </Suspense>
        <SectionDivider />
        <Suspense fallback={
          <div className="w-full">
            <div className="mb-6 flex flex-col items-center px-1 py-4 text-center sm:mb-10">
              <div className="mb-3 h-5 w-32 animate-pulse rounded-md bg-muted" />
              <div className="h-10 w-48 animate-pulse rounded-md bg-muted" />
              <div className="mt-3 h-6 w-80 max-w-full animate-pulse rounded-md bg-muted" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <ArticleCardSkeleton key={i} />
              ))}
            </div>
          </div>
        }>
          <RecentPosts />
        </Suspense>
        <SectionDivider />
        <ConnectSection />
      </div>
    </>
  );
}
