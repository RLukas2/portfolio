import { Link } from '@tanstack/react-router';
import { type ArticleType } from '@xbrk/types';
import { LazyImage } from '@xbrk/ui/lazy-image';
import { formatDate } from '@xbrk/utils';
import { ArrowUpRight, Calendar, Eye, ThumbsUp } from 'lucide-react';

interface ArticleCardProps {
  article: ArticleType & { viewCount: number; likesCount: number };
}

/**
 * ArticleCard component displays a blog article preview card.
 *
 * Features:
 * - Responsive card with hover effects (border, shadow, gradient overlay)
 * - Lazy-loaded cover image with zoom effect on hover
 * - Article title, description, and metadata (date, views, likes)
 * - "Read" indicator that appears on hover
 * - Accessible link overlay for entire card
 *
 * Uses direct Tailwind classes for styling (no Container component).
 * Designed for use in grid layouts on blog list and home pages.
 *
 * @param article - Article data including title, description, image, and engagement metrics
 * @returns Rendered article card with interactive hover effects
 */
const ArticleCard = ({ article }: ArticleCardProps) => (
  <article className="group relative flex flex-col overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:border-foreground/20 hover:shadow-xl">
    {/* Hover gradient overlay */}
    <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-violet-500/5 via-transparent to-pink-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

    {article.imageUrl && (
      <div className="relative overflow-hidden">
        <LazyImage
          alt={article.title}
          className="w-full"
          fill
          height={250}
          imageClassName="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          src={article.imageUrl}
          width={500}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* View indicator */}
        <div className="absolute right-4 bottom-4 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 font-medium text-neutral-900 text-sm opacity-0 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
          <span>Read</span>
          <ArrowUpRight
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            size={14}
          />
        </div>
      </div>
    )}

    <div className="relative flex flex-1 flex-col gap-3 p-5">
      <h2 className="line-clamp-2 font-semibold text-xl transition-colors group-hover:text-primary">{article.title}</h2>
      {article.description && (
        <p className="line-clamp-2 text-muted-foreground text-sm leading-relaxed">{article.description}</p>
      )}

      <div className="mt-auto flex flex-wrap items-center gap-4 border-t pt-4 text-muted-foreground text-xs">
        {article.createdAt && (
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {formatDate(article.createdAt)}
          </span>
        )}

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Eye size={12} />
            {article.viewCount}
          </span>
          <span className="flex items-center gap-1">
            <ThumbsUp size={12} />
            {article.likesCount}
          </span>
        </div>
      </div>
    </div>

    <Link
      className="absolute inset-0"
      params={{
        articleId: article.slug,
      }}
      to="/blog/$articleId"
    >
      <span className="sr-only">View Article</span>
    </Link>
  </article>
);

export default ArticleCard;
