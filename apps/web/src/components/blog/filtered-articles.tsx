import type { ArticleType } from '@xbrk/types';
import { cn } from '@xbrk/ui';
import { Input } from '@xbrk/ui/input';
import { Label } from '@xbrk/ui/label';
import { m, AnimatePresence } from 'framer-motion';
import { FileText, Search } from 'lucide-react';
import { type ChangeEvent, useMemo, useState } from 'react';
import { containerVariants, itemVariants } from '@/lib/constants/framer-motion-variants';
import EmptyState from '../shared/empty-state';
import Link from '@/components/shared/link';
import { formatDate } from '@xbrk/utils';
import { LazyImage } from '@xbrk/ui/lazy-image';

interface FilteredArticlesProps {
  articles: (ArticleType & { viewCount: number; likesCount: number })[];
}

export default function FilteredArticles({ articles }: Readonly<FilteredArticlesProps>) {
  const [searchValue, setSearchValue] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [hoveredArticle, setHoveredArticle] = useState<ArticleType | null>(null);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    for (const article of articles) {
      if (article.tags) {
        for (const tag of article.tags) {
          tags.add(tag);
        }
      }
    }
    return Array.from(tags).sort();
  }, [articles]);

  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchValue.toLowerCase());

    if (selectedTags.length === 0) {
      return matchesSearch;
    }

    const articleTags = article.tags || [];
    const matchesTags = selectedTags.some((tag) => articleTags.includes(tag));

    return matchesSearch && matchesTags;
  });

  // Group by year
  const groupedArticles = useMemo(() => {
    const groups: Record<string, typeof articles> = {};
    for (const article of filteredArticles) {
      const year = new Date(article.createdAt).getFullYear().toString();
      if (!groups[year]) {
        groups[year] = [];
      }
      groups[year].push(article);
    }
    return Object.entries(groups).sort(([a], [b]) => Number(b) - Number(a)); // Sort years descending
  }, [filteredArticles]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  // If no articles at all, show empty state without search
  if (articles.length === 0) {
    return <EmptyState message="The posts are playing hide and seek – we just can't find them!" />;
  }

  return (
    <div className="relative flex flex-col md:flex-row gap-12 lg:gap-24">
      {/* Left Column: Content */}
      <div className="w-full md:w-2/3 flex-1 pb-24">
        {/* Search box */}
        <div className="group relative mb-6 rounded-xl transition-all duration-300">
          <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 blur transition duration-500 group-hover:opacity-100" />
          <div className="relative flex items-center rounded-xl border border-white/10 bg-background/50 backdrop-blur-md">
            <Input
              aria-label="Search articles"
              className="h-14 w-full rounded-xl border-none bg-transparent pl-12 shadow-none focus-visible:ring-0 text-lg placeholder:text-muted-foreground/60"
              id="search"
              onChange={handleInputChange}
              placeholder="Search articles..."
              type="text"
              value={searchValue}
            />
            <Label htmlFor="search">
              <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
            </Label>
          </div>
        </div>

        {allTags.length > 0 && (
          <div className="mb-12 flex flex-wrap gap-2">
            {allTags.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  aria-pressed={isSelected}
                  className={cn(
                    'inline-flex w-fit shrink-0 cursor-pointer items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-full px-4 py-2 font-medium text-sm transition-all duration-300',
                    isSelected
                      ? 'bg-foreground text-background shadow-md'
                      : 'bg-background/50 backdrop-blur-md border border-white/10 text-muted-foreground hover:text-foreground hover:border-white/30',
                  )}
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  type="button"
                >
                  {tag}
                </button>
              );
            })}
          </div>
        )}

        {filteredArticles.length ? (
          <m.div animate="visible" className="flex flex-col gap-16" initial={false} variants={containerVariants}>
            {groupedArticles.map(([year, yearArticles]) => (
              <div key={year} className="relative">
                <div className="sticky top-24 z-10 mb-8 w-fit rounded-full border border-white/10 bg-background/80 px-4 py-1.5 backdrop-blur-md">
                  <h3 className="font-mono text-sm font-semibold text-primary">{year}</h3>
                </div>
                <div className="flex flex-col border-l border-white/10 ml-4 pl-8 sm:pl-12">
                  {yearArticles.map((article) => (
                    <m.div key={article.slug} variants={itemVariants} className="group py-6 first:pt-0 last:pb-0 border-b border-white/5 last:border-0 relative">
                       <Link
                         className="block"
                         params={{ articleId: article.slug }}
                         to="/blog/$articleId"
                         onMouseEnter={() => setHoveredArticle(article)}
                         onMouseLeave={() => setHoveredArticle(null)}
                       >
                         <div className="flex flex-col gap-2">
                           <span className="text-sm text-muted-foreground font-mono">
                             {formatDate(article.createdAt)}
                           </span>
                           <h4 className="text-2xl sm:text-3xl font-heading font-bold text-foreground/80 transition-colors duration-300 group-hover:text-foreground">
                             {article.title}
                           </h4>
                         </div>
                       </Link>
                    </m.div>
                  ))}
                </div>
              </div>
            ))}
          </m.div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background/50 border border-white/10">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="font-medium text-lg text-foreground">No articles found</p>
              <p className="text-muted-foreground">Try a different search term</p>
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Sticky Preview Panel (Desktop Only) */}
      <div className="hidden md:block w-1/3 sticky top-32 h-[calc(100vh-10rem)]">
         <AnimatePresence mode="wait">
           {hoveredArticle && hoveredArticle.imageUrl ? (
              <m.div
                key={hoveredArticle.slug}
                initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className="w-full h-[400px] rounded-2xl overflow-hidden glass-panel relative"
              >
                <LazyImage
                  alt={hoveredArticle.title}
                  src={hoveredArticle.imageUrl}
                  fill
                  imageClassName="object-cover"
                  sizes="(max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                   <p className="text-white font-semibold text-lg line-clamp-2">{hoveredArticle.title}</p>
                </div>
              </m.div>
           ) : (
              <div className="w-full h-[400px] rounded-2xl border border-dashed border-white/10 flex items-center justify-center text-muted-foreground/50 font-mono text-sm">
                Hover to preview
              </div>
           )}
         </AnimatePresence>
      </div>
    </div>
  );
}
