import { createFileRoute } from '@tanstack/react-router';
import { siteConfig } from '@xbrk/config';
import ConnectSection from '@/components/home/connect-section';
import FeaturedProjects from '@/components/home/featured-projects';
import PersonalHero from '@/components/home/personal-hero';
import RecentPosts from '@/components/home/recent-posts';
import { seo } from '@/lib/seo';
import { generateStructuredDataGraph, getHomepageSchemas } from '@/lib/structured-data';

export const Route = createFileRoute('/(public)/')({
  component: Home,
  head: () => {
    const seoData = seo({
      title: siteConfig.title,
      description: siteConfig.description,
      keywords: siteConfig.keywords,
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

      <div className="flex flex-col items-center space-y-16 pb-16 sm:space-y-24 sm:pb-24">
        <RecentPosts />
        <FeaturedProjects />
        <ConnectSection />
      </div>
    </>
  );
}
