import { createFileRoute } from '@tanstack/react-router';
import { siteConfig } from '@xbrk/config';
import { Spinner } from '@xbrk/ui/spinner';
import { Suspense } from 'react';
import ConnectSection from '@/components/home/connect-section';
import FeaturedProjects from '@/components/home/featured-projects';
import PersonalHero from '@/components/home/personal-hero';
import RecentPosts from '@/components/home/recent-posts';
import SectionDivider from '@/components/shared/section-divider';
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
        <Suspense fallback={<Spinner />}>
          <FeaturedProjects />
        </Suspense>
        <SectionDivider />
        <Suspense fallback={<Spinner />}>
          <RecentPosts />
        </Suspense>
        <ConnectSection />
      </div>
    </>
  );
}
