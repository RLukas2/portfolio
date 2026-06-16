import { createFileRoute } from '@tanstack/react-router';
import { siteConfig } from '@xbrk/config';

import ConnectSection from '@/components/home/connect-section';
import FeaturedProjects from '@/components/home/featured-projects';
import PersonalHero from '@/components/home/personal-hero';
import RecentPosts from '@/components/home/recent-posts';

import { queryKeys } from '@/lib/query-keys';
import { seo } from '@/lib/seo';
import { $getAllPublicArticles, $getAllPublicProjects } from '@/lib/server';
import { generateStructuredDataGraph, getHomepageSchemas } from '@/lib/structured-data';
import { getBaseUrl } from '@/lib/utils';

export const Route = createFileRoute('/(public)/')({
  component: Home,
  loader: async ({ context: { queryClient } }) => {
    const [projects] = await Promise.all([
      queryClient.ensureQueryData({
        queryKey: queryKeys.project.listPublic(),
        queryFn: () => $getAllPublicProjects(),
      }),
      queryClient.ensureQueryData({
        queryKey: queryKeys.blog.listPublic(),
        queryFn: () => $getAllPublicArticles(),
      }),
    ]);

    const featured = projects.filter((p) => p.isFeatured).slice(0, 4);
    const featuredProjects = featured.length > 0 ? featured : projects.slice(0, 4);

    return { featuredProjects };
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
  const { featuredProjects } = Route.useLoaderData();

  return (
    <>
      <PersonalHero />

      <div className="flex flex-col items-center gap-16 sm:gap-32">
        <FeaturedProjects featuredProjects={featuredProjects} />
        <RecentPosts />
        <ConnectSection />
      </div>
    </>
  );
}
