import type { Article } from '@xbrk/db';
import ArticleCard from '@/components/blog/article-card';

interface ArticleRelatedProps {
  relatedArticles: Array<Article & { viewCount: number; likesCount: number }>;
}

const ArticleRelated = ({ relatedArticles }: ArticleRelatedProps) => {
  if (!(relatedArticles && relatedArticles.length > 0)) {
    return null;
  }

  return (
    <>
      <h2 className="mb-6 font-bold font-heading text-2xl tracking-tight">Related Posts</h2>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {relatedArticles.map((article) => (
          <ArticleCard article={article} key={article.slug} />
        ))}
      </div>
    </>
  );
};

export default ArticleRelated;
