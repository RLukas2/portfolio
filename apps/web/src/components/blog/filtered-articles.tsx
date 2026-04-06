import type { ArticleType } from '@xbrk/types';
import { Input } from '@xbrk/ui/input';
import { Label } from '@xbrk/ui/label';
import { motion } from 'framer-motion';
import { FileText, Search } from 'lucide-react';
import { type ChangeEvent, useState } from 'react';
import { containerVariants, itemVariants } from '@/lib/constants/framer-motion-variants';
import EmptyState from '../shared/empty-state';
import ArticleCard from './article-card';

interface FilteredArticlesProps {
  articles: (ArticleType & { viewCount: number; likesCount: number })[];
}

export default function FilteredArticles({ articles }: Readonly<FilteredArticlesProps>) {
  const [searchValue, setSearchValue] = useState('');

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchValue.toLowerCase()),
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  // If no articles at all, show empty state without search
  if (articles.length === 0) {
    return <EmptyState message="The posts are playing hide and seek – we just can't find them!" />;
  }

  return (
    <>
      {/* Search box */}
      <div className="relative mb-8">
        <Input
          aria-label="Search articles"
          className="h-12 rounded-xl border-none bg-muted pl-12 focus-visible:ring-1"
          id="search"
          onChange={handleInputChange}
          placeholder="Search articles..."
          type="text"
          value={searchValue}
        />
        <Label htmlFor="search">
          <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        </Label>
      </div>

      {filteredArticles.length ? (
        <motion.div
          animate="visible"
          className="grid gap-6 sm:grid-cols-2"
          initial="hidden"
          variants={containerVariants}
        >
          {filteredArticles.map((article) => (
            <motion.div key={article.slug} variants={itemVariants}>
              <ArticleCard article={article} />
            </motion.div>
          ))}
        </motion.div>
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
