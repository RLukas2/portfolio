import { useSuspenseQuery } from '@tanstack/react-query';
import { cn } from '@xbrk/ui';
import { buttonVariants } from '@xbrk/ui/button';
import { m, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import Link from '@/components/shared/link';
import { containerVariantsFast, itemVariantsDown } from '@/lib/constants/framer-motion-variants';
import { queryKeys } from '@/lib/query-keys';
import { $getAllPublicArticles } from '@/lib/server';
import EmptyState from '../shared/empty-state';

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

/**
 * RecentPosts component displays the latest blog posts on the home page.
 *
 * Features:
 * - Fetches and displays the 3 most recent published articles
 * - Animated section with scroll-triggered visibility
 * - Responsive grid layout (1 column mobile, 2 tablet, 3 desktop)
 * - Staggered animation for article cards
 * - Link to view all blog posts
 * - Empty state when no articles are available
 *
 * Uses direct Tailwind classes for layout (no Container component).
 * Layout already provides container, so this component renders content directly.
 *
 * @returns Rendered recent posts section with article cards and navigation
 */
const RecentPosts = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const { data: articles } = useSuspenseQuery({
    queryKey: queryKeys.blog.listPublic(),
    queryFn: () => $getAllPublicArticles(),
  });

  const recentArticles = articles.slice(0, 3);

  return (
    <m.section
      animate={isInView ? 'visible' : 'hidden'}
      className="relative w-full py-16 sm:py-24"
      id="recent-posts"
      initial={false}
      ref={sectionRef}
      transition={{ duration: 0.5 }}
      variants={sectionVariants}
    >
      <div className="mb-12 flex flex-col items-start px-1 py-4">
        <m.h2
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          className="font-bold font-heading text-4xl tracking-tight sm:text-5xl"
          initial={false}
          transition={{ delay: 0.2 }}
        >
          Latest Writing
        </m.h2>
        <m.p
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          className="mt-4 max-w-2xl text-lg text-muted-foreground"
          initial={false}
          transition={{ delay: 0.3 }}
        >
          Thoughts on tech, side projects, and things I find interesting.
        </m.p>
      </div>

      {recentArticles.length > 0 ? (
        <div className="flex flex-col gap-12 sm:gap-16">
          <m.div
            animate={isInView ? 'visible' : 'hidden'}
            className="flex flex-col gap-8"
            initial={false}
            variants={containerVariantsFast}
          >
            {recentArticles.map((article) => (
              <m.div
                className="group border-border/50 border-b pb-8 last:border-0 last:pb-0"
                key={article.slug}
                variants={itemVariantsDown}
              >
                <Link
                  className="flex flex-col gap-3 no-underline"
                  params={{ articleId: article.slug }}
                  to="/blog/$articleId"
                >
                  <p className="text-muted-foreground text-sm">
                    {article.createdAt &&
                      new Date(article.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                  </p>
                  <h3 className="font-heading text-2xl transition-colors group-hover:text-primary">{article.title}</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">{article.description}</p>
                </Link>
              </m.div>
            ))}
          </m.div>

          <m.div
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            className="flex"
            initial={false}
            transition={{ delay: 0.5 }}
          >
            <Link className={cn(buttonVariants({ variant: 'ghost', size: 'lg' }), 'group -ml-4')} href="/blog">
              Read all articles
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </m.div>
        </div>
      ) : (
        <EmptyState message="The posts are playing hide and seek – we just can't find them!" />
      )}
    </m.section>
  );
};

export default RecentPosts;
