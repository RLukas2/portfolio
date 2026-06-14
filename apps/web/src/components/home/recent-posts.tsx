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
import ArticleCard from '../blog/article-card';
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
      className="w-full"
      id="recent-posts"
      initial={false}
      ref={sectionRef}
      transition={{ duration: 0.5 }}
      variants={sectionVariants}
    >
      <div className="mb-6 flex flex-col items-center px-1 py-4 text-center sm:mb-10">
        <m.span
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          className="mb-3 font-medium text-primary text-sm uppercase tracking-widest"
          initial={false}
          transition={{ delay: 0.1 }}
        >
          From the Blog
        </m.span>
        <m.h2
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          className="font-bold text-3xl tracking-tight sm:text-4xl"
          initial={false}
          transition={{ delay: 0.2 }}
        >
          Latest Writing
        </m.h2>
        <m.p
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          className="mt-3 max-w-2xl text-muted-foreground"
          initial={false}
          transition={{ delay: 0.3 }}
        >
          Thoughts on tech, side projects, and things I find interesting.
        </m.p>
      </div>

      {recentArticles.length > 0 ? (
        <>
          <m.div
            animate={isInView ? 'visible' : 'hidden'}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
            initial={false}
            variants={containerVariantsFast}
          >
            {recentArticles.map((article) => (
              <m.div key={article.slug} variants={itemVariantsDown}>
                <ArticleCard article={article} />
              </m.div>
            ))}
          </m.div>

          <m.div
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            className="mt-10 flex justify-center"
            initial={false}
            transition={{ delay: 0.5 }}
          >
            <Link className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'group')} href="/blog">
              View all posts
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </m.div>
        </>
      ) : (
        <EmptyState message="The posts are playing hide and seek – we just can't find them!" />
      )}
    </m.section>
  );
};

export default RecentPosts;
