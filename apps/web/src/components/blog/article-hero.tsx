import type { Article, User } from '@xbrk/db';
import { LazyImage } from '@xbrk/ui/lazy-image';
import { calculateReadingTime, formatDate } from '@xbrk/utils';
import { Calendar, Clock, Eye, Heart, MessageCircle } from 'lucide-react';
import ArticleAuthor from '@/components/blog/author';
import LikeButton from '@/components/blog/like-button';

interface ArticleHeroProps {
  article: Article & {
    author: User;
    viewCount: number;
    likesCount: number;
    comments: unknown[];
  };
}

const ArticleHero = ({ article }: ArticleHeroProps) => {
  const readingTime = calculateReadingTime(article.content ?? '');

  return (
    <>
      {/* Background glow effect */}
      <div className="pointer-events-none absolute -top-20 left-1/2 -z-10 h-64 w-full max-w-2xl -translate-x-1/2">
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(139, 92, 246, 0.08) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Title and like button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <h1 className="mt-2 font-heading text-3xl leading-tight tracking-tight sm:text-4xl lg:text-5xl">
          {article.title}
        </h1>
        <div className="sm:mt-3 sm:shrink-0">
          <LikeButton article={article} />
        </div>
      </div>

      {/* Modern metrics bar */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        {article.createdAt && (
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-muted/50 px-3 py-1.5 text-muted-foreground text-xs backdrop-blur-sm">
            <Calendar className="size-3.5" />
            <time dateTime={article.createdAt.toISOString()}>{formatDate(article.createdAt)}</time>
          </div>
        )}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-muted/50 px-3 py-1.5 text-muted-foreground text-xs backdrop-blur-sm">
          <Clock className="size-3.5" />
          <span>{readingTime} min read</span>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-muted/50 px-3 py-1.5 text-muted-foreground text-xs backdrop-blur-sm">
          <Eye className="size-3.5" />
          <span>{article.viewCount.toLocaleString()} views</span>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-200/50 bg-rose-50/50 px-3 py-1.5 text-rose-600 text-xs backdrop-blur-sm dark:border-rose-800/50 dark:bg-rose-950/30 dark:text-rose-400">
          <Heart className="size-3.5" />
          <span>{article.likesCount} likes</span>
        </div>
        {article.comments && article.comments.length > 0 && (
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-muted/50 px-3 py-1.5 text-muted-foreground text-xs backdrop-blur-sm">
            <MessageCircle className="size-3.5" />
            <span>{article.comments.length} comments</span>
          </div>
        )}
      </div>

      {/* Author section */}
      <div className="mt-6">
        <ArticleAuthor article={article} />
      </div>

      {/* Featured image with glow effect */}
      {article.imageUrl && (
        <div className="relative my-8 sm:my-10">
          {/* Glow effect behind image */}
          <div className="absolute -inset-2 rounded-3xl bg-linear-to-br from-violet-500/10 via-fuchsia-500/5 to-cyan-500/10 blur-xl" />

          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-white/5 to-white/2 p-1.5 shadow-2xl">
            <LazyImage
              alt={article.title}
              className="w-full"
              fill
              height={500}
              imageClassName="rounded-xl object-cover"
              priority={true}
              sizes="(max-width: 832px) 100vw, (max-width: 1280px) 75vw, 832px"
              src={article.imageUrl}
              width={832}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ArticleHero;
