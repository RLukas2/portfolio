import type { ArticleType } from '@xbrk/types';
import { cn } from '@xbrk/ui';
import { Input } from '@xbrk/ui/input';
import { Label } from '@xbrk/ui/label';
import { AnimatePresence, m } from 'framer-motion';
import { FileText, Search } from 'lucide-react';
import { type ChangeEvent, useMemo, useState } from 'react';
import Link from '@/components/shared/link';
import { containerVariants, itemVariants } from '@/lib/constants/framer-motion-variants';
import EmptyState from '../shared/empty-state';

interface FilteredArticlesProps {
  articles: (ArticleType & { viewCount: number; likesCount: number })[];
}

export default function FilteredArticles({ articles }: Readonly<FilteredArticlesProps>) {
  const [searchValue, setSearchValue] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [hoveredArticle, setHoveredArticle] = useState<
    (ArticleType & { viewCount: number; likesCount: number }) | null
  >(null);

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
    <>
      {/* Search box */}
      <div className="group relative mb-4 rounded-xl transition-all duration-300 hover:shadow-md hover:shadow-primary/5">
        <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-primary/30 to-secondary/30 opacity-0 blur transition duration-500 group-hover:opacity-100" />
        <div className="relative flex items-center rounded-xl border border-border/50 bg-background/80 backdrop-blur-md">
          <Input
            aria-label="Search articles"
            className="h-12 w-full rounded-xl border-none bg-transparent pl-12 shadow-none focus-visible:ring-0"
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
        <div className="mb-8 flex flex-wrap gap-2">
          {allTags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                aria-pressed={isSelected}
                className={cn(
                  'inline-flex w-fit shrink-0 cursor-pointer items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-full border px-3 py-1.5 font-medium text-xs transition-[color,box-shadow,background-color] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
                  isSelected
                    ? 'border-transparent bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-background text-foreground hover:bg-accent hover:text-accent-foreground',
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
        <div className="relative flex flex-col gap-8 lg:flex-row">
          {/* List Content */}
          <m.div
            animate="visible"
            className="flex w-full flex-col gap-12 lg:w-1/2"
            initial={false}
            variants={containerVariants}
          >
            {Object.entries(
              filteredArticles.reduce(
                (acc, article) => {
                  const year = new Date(article.createdAt || new Date()).getFullYear();
                  if (!acc[year]) {
                    acc[year] = [];
                  }
                  acc[year].push(article);
                  return acc;
                },
                {} as Record<number, typeof filteredArticles>,
              ),
            )
              .sort(([a], [b]) => Number(b) - Number(a))
              .map(([year, yearArticles]) => (
                <div className="flex flex-col gap-6" key={year}>
                  <h2 className="font-heading text-3xl text-foreground">{year}</h2>
                  <div className="flex flex-col gap-4">
                    {yearArticles.map((article) => (
                      <m.div key={article.slug} variants={itemVariants}>
                        <Link
                          className="group flex flex-col gap-2 border-border/50 border-b py-4 no-underline last:border-0"
                          onMouseEnter={() => setHoveredArticle(article)}
                          onMouseLeave={() => setHoveredArticle(null)}
                          params={{ articleId: article.slug }}
                          to="/blog/$articleId"
                        >
                          <h3 className="font-heading text-2xl transition-colors group-hover:text-primary">
                            {article.title}
                          </h3>
                          <p className="line-clamp-2 text-lg text-muted-foreground">{article.description}</p>
                        </Link>
                      </m.div>
                    ))}
                  </div>
                </div>
              ))}
          </m.div>

          {/* Hover Preview Panel (Sticky on right) */}
          <div className="glassmorphism pointer-events-none sticky top-24 hidden h-[calc(100vh-120px)] overflow-hidden rounded-2xl p-2 lg:block lg:w-1/2">
            <AnimatePresence mode="wait">
              {hoveredArticle ? (
                <m.div
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative flex h-full w-full flex-col overflow-hidden rounded-xl bg-background/50"
                  exit={{ opacity: 0, scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  key={hoveredArticle.slug}
                  transition={{ duration: 0.3 }}
                >
                  {hoveredArticle.imageUrl ? (
                    <div className="relative w-full flex-1">
                      <img
                        alt={hoveredArticle.title}
                        className="absolute inset-0 h-full w-full object-cover"
                        height={800}
                        src={hoveredArticle.imageUrl}
                        width={800}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                      <div className="absolute right-0 bottom-0 left-0 flex flex-col gap-2 p-8">
                        <h3 className="font-heading text-3xl text-foreground">{hoveredArticle.title}</h3>
                        <p className="line-clamp-3 text-lg text-muted-foreground">{hoveredArticle.description}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-full w-full flex-col justify-center gap-6 p-10">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <FileText className="h-5 w-5" />
                        <span className="font-medium text-sm uppercase tracking-wider">Preview</span>
                      </div>
                      <h3 className="font-heading text-4xl text-foreground leading-tight">{hoveredArticle.title}</h3>
                      <p className="text-muted-foreground text-xl leading-relaxed">{hoveredArticle.description}</p>
                    </div>
                  )}
                </m.div>
              ) : (
                <m.div
                  animate={{ opacity: 1 }}
                  className="flex h-full w-full items-center justify-center rounded-xl border-2 border-border/50 border-dashed bg-muted/20"
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0 }}
                  key="empty"
                >
                  <span className="font-medium text-lg text-muted-foreground">Hover over an article to preview</span>
                </m.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="font-medium text-lg">No articles found</p>
            <p className="text-muted-foreground">Try a different search term</p>
          </div>
        </div>
      )}
    </>
  );
}
