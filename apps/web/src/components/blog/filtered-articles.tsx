import type { ArticleType } from '@xbrk/types';
import { cn } from '@xbrk/ui';
import { Input } from '@xbrk/ui/input';
import { Label } from '@xbrk/ui/label';
import { m } from 'framer-motion';
import { FileText, Search } from 'lucide-react';
import { type ChangeEvent, useMemo, useState } from 'react';
import { containerVariants, itemVariants } from '@/lib/constants/framer-motion-variants';
import EmptyState from '../shared/empty-state';
import ArticleCard from './article-card';

interface FilteredArticlesProps {
  articles: (ArticleType & { viewCount: number; likesCount: number })[];
}

export default function FilteredArticles({ articles }: Readonly<FilteredArticlesProps>) {
  const [searchValue, setSearchValue] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

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
        <m.div animate="visible" className="grid gap-6 sm:grid-cols-2" initial={false} variants={containerVariants}>
          {filteredArticles.map((article) => (
            <m.div key={article.slug} variants={itemVariants}>
              <ArticleCard article={article} />
            </m.div>
          ))}
        </m.div>
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
