import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { siteConfig } from '@xbrk/config';
import { Skeleton } from '@xbrk/ui/skeleton';
import Projects from '@/components/projects/projects';
import PageHeading from '@/components/shared/page-heading';
import { pagesData } from '@/lib/data/pages-data';
import { seoData as seoMetadata } from '@/lib/data/seo-data';
import { queryKeys } from '@/lib/query-keys';
import { seo } from '@/lib/seo';
import { $getAllPublicProjects } from '@/lib/server';
import { generateStructuredDataGraph, getProjectListSchemas } from '@/lib/structured-data';
import { getBaseUrl } from '@/lib/utils';

export const Route = createFileRoute('/(public)/projects/')({
  component: RouteComponent,
  loader: async ({ context: { queryClient } }) =>
    await queryClient.prefetchQuery({
      queryKey: queryKeys.project.listPublic(),
      queryFn: () => $getAllPublicProjects(),
    }),
  head: () => {
    const seoData = seo({
      title: `Projects | ${siteConfig.title}`,
      description: seoMetadata.projects.description,
      keywords: seoMetadata.projects.keywords,
      url: `${getBaseUrl()}/projects`,
      canonical: `${getBaseUrl()}/projects`,
    });
    const structuredData = generateStructuredDataGraph(getProjectListSchemas());

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

function ProjectsSkeleton() {
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
    data: projects,
    isLoading,
    isFetching,
  } = useSuspenseQuery({
    queryKey: queryKeys.project.listPublic(),
    queryFn: () => $getAllPublicProjects(),
  });

  return (
    <>
      <PageHeading description={pagesData.projects.description} title={pagesData.projects.title} />
      {isLoading || isFetching ? <ProjectsSkeleton /> : <Projects projects={projects} />}
    </>
  );
}
