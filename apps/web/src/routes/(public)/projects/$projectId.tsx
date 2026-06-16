import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, ErrorComponent, notFound } from '@tanstack/react-router';
import { siteConfig } from '@xbrk/config';
import { RenderedMarkdown } from '@xbrk/md';
import ProjectLink from '@xbrk/shared/link';
import { STACKS } from '@xbrk/shared/stack';
import Icon from '@xbrk/ui/icon';
import { NotFound } from '@xbrk/ui/not-found';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@xbrk/ui/tooltip';
import { m } from 'framer-motion';
import { Code2, ExternalLink, Sparkles } from 'lucide-react';
import { siGithub } from 'simple-icons';
import TableOfContents from '@/components/blog/toc';
import BreadcrumbNavigation from '@/components/shared/breadcrumb-navigation';
import { queryKeys } from '@/lib/query-keys';
import { seo } from '@/lib/seo';
import { $getProjectBySlug } from '@/lib/server';
import { generateStructuredDataGraph, getProjectSchemas } from '@/lib/structured-data';
import { getBaseUrl } from '@/lib/utils';

export const Route = createFileRoute('/(public)/projects/$projectId')({
  loader: async ({ params: { projectId }, context: { queryClient } }) => {
    try {
      const data = await queryClient.ensureQueryData({
        queryKey: queryKeys.project.detail(projectId),
        queryFn: () => $getProjectBySlug({ data: { slug: projectId } }),
      });
      return {
        title: data?.title,
        description: data?.description,
        image: data?.imageUrl,
        slug: data?.slug,
        githubUrl: data?.githubUrl,
        stacks: data?.stacks,
        createdAt: data?.createdAt,
        updatedAt: data?.updatedAt,
      };
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message === 'Project not found' || error.message === 'Project is not public')
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
      url: `${getBaseUrl()}/projects/${loaderData?.slug}`,
      canonical: `${getBaseUrl()}/projects/${loaderData?.slug}`,
    });

    const structuredData = loaderData?.title
      ? generateStructuredDataGraph(
          getProjectSchemas({
            title: loaderData.title,
            description: loaderData.description || '',
            slug: loaderData.slug || '',
            image: loaderData.image ?? undefined,
            githubUrl: loaderData.githubUrl ?? undefined,
            stacks: loaderData.stacks ?? undefined,
            dateCreated: loaderData.createdAt?.toISOString(),
            dateModified: loaderData.updatedAt?.toISOString(),
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
  notFoundComponent: () => <NotFound>Project not found</NotFound>,
});

function RouteComponent() {
  const { projectId } = Route.useParams();
  const { data: project } = useSuspenseQuery({
    queryKey: queryKeys.project.detail(projectId),
    queryFn: () => $getProjectBySlug({ data: { slug: projectId } }),
  });

  if (!project) {
    return null;
  }

  const { title, description, stacks, githubUrl, demoUrl, imageUrl, contentRendering, isFeatured, toc } = project;
  const thumbnailUrl = imageUrl ?? `https://placehold.co/1200x630/darkgray/white/png?text=${encodeURIComponent(title)}`;

  return (
    <article className="relative lg:gap-10 xl:grid xl:max-w-6xl xl:grid-cols-[1fr_280px] 2xl:max-w-7xl">
      <div className="w-full min-w-0">
        {/* Breadcrumb */}
        <m.div animate={{ opacity: 1, y: 0 }} initial={false} transition={{ duration: 0.5 }}>
          <BreadcrumbNavigation pageTitle={title} section={{ label: 'Projects', href: '/projects' }} />
        </m.div>

        {/* Immersive Header */}
        <m.div
          animate={{ opacity: 1, y: 0 }}
          className="relative my-8 flex min-h-[50vh] flex-col justify-end overflow-hidden rounded-2xl p-8 sm:p-12"
          initial={false}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Background Image / Gradient */}
          <div className="absolute inset-0 -z-20 bg-muted">
            <img alt={title} className="h-full w-full object-cover" height={600} src={thumbnailUrl} width={1200} />
          </div>
          {/* Gradient Overlay defined by design system */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-purple-500/10 mix-blend-overlay" />

          {/* Title section */}
          <div className="flex flex-col gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h1 className="max-w-[20ch] font-heading text-4xl text-foreground leading-tight tracking-tight sm:text-5xl lg:text-7xl">
                  {title}
                </h1>
                {isFeatured && (
                  <span className="mt-2 inline-flex items-center gap-1.5 self-start rounded-full bg-linear-to-r from-amber-500 to-orange-500 px-3 py-1 font-medium text-white text-xs shadow-lg sm:mt-0 sm:self-center">
                    <Sparkles size={12} />
                    Featured
                  </span>
                )}
              </div>
              {description && (
                <p className="max-w-2xl font-light text-lg text-muted-foreground leading-relaxed sm:text-xl">
                  {description}
                </p>
              )}
            </div>

            {/* Tech stack and links bar */}
            <div className="flex flex-col gap-6 border-border/20 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
              {/* Tech stack */}
              {stacks && stacks.length > 0 && (
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-background/50 px-3 py-1.5 text-muted-foreground text-xs backdrop-blur-sm">
                    <Code2 className="size-3.5" />
                    Tech Stack
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {stacks.map((stack) => (
                      <TooltipProvider delayDuration={200} key={stack}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm transition-all hover:scale-110 hover:border-foreground/20 hover:bg-muted hover:shadow-lg">
                              {STACKS[stack] && <Icon className="h-4 w-4" icon={STACKS[stack]} />}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <span className="font-medium">{stack}</span>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </div>
              )}

              {/* Project links */}
              <div className="flex items-center gap-3">
                {githubUrl && (
                  <ProjectLink
                    icon={<Icon className="h-4 w-4" icon={siGithub} />}
                    title="Source Code"
                    url={githubUrl}
                  />
                )}
                {demoUrl && <ProjectLink icon={<ExternalLink className="h-4 w-4" />} title="Live Demo" url={demoUrl} />}
              </div>
            </div>
          </div>
        </m.div>

        {/* Project content */}
        {contentRendering && (
          <m.div
            animate={{ opacity: 1, y: 0 }}
            className="mt-12"
            initial={false}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="prose dark:prose-invert mt-12 max-w-none prose-headings:font-heading prose-a:text-primary prose-headings:tracking-tight prose-a:no-underline hover:prose-a:underline">
              <RenderedMarkdown rendering={contentRendering} />
            </div>
          </m.div>
        )}
      </div>

      {/* Table of contents - subtle sticky sidebar */}
      {toc && toc.length > 0 && (
        <m.div
          animate={{ opacity: 1, x: 0 }}
          className="hidden text-sm opacity-60 transition-opacity hover:opacity-100 xl:block"
          initial={false}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="sticky top-24 pt-8">
            <TableOfContents toc={toc} />
          </div>
        </m.div>
      )}
    </article>
  );
}
