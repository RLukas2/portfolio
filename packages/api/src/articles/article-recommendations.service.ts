import { articles } from '@xbrk/db/schema';
import { and, desc, eq, inArray, sql } from 'drizzle-orm';
import type { DbClient } from '../shared/db';

export async function getRelatedArticles(db: DbClient, article: { id: string; tags: string[] | null }, maxResults = 3) {
  const getRelatedIds = async (): Promise<string[]> => {
    if (!article.tags?.length) {
      const results = await db.query.articles.findMany({
        columns: { id: true },
        where: and(eq(articles.isDraft, false), sql`${articles.id} != ${article.id}`),
        orderBy: desc(articles.createdAt),
        limit: maxResults,
      });
      return results.map((r) => r.id);
    }

    const allOtherArticles = await db.query.articles.findMany({
      columns: { id: true, tags: true },
      where: and(eq(articles.isDraft, false), sql`${articles.id} != ${article.id}`),
      orderBy: desc(articles.createdAt),
    });

    const tagMatched = allOtherArticles
      .filter((a) => a.tags?.some((t) => article.tags?.includes(t)))
      .slice(0, maxResults)
      .map((a) => a.id);

    if (tagMatched.length >= maxResults) {
      return tagMatched;
    }

    const existingIds = new Set(tagMatched);
    const recentArticles = await db.query.articles.findMany({
      columns: { id: true },
      where: and(eq(articles.isDraft, false), sql`${articles.id} != ${article.id}`),
      orderBy: desc(articles.createdAt),
      limit: maxResults - tagMatched.length,
    });

    return [...tagMatched, ...recentArticles.filter((a) => !existingIds.has(a.id)).map((a) => a.id)];
  };

  const articleIds = await getRelatedIds();
  if (!articleIds.length) {
    return [];
  }

  const relatedRows = await db.query.articles.findMany({
    where: inArray(articles.id, articleIds),
  });

  const counts = await db
    .select({
      articleId: articles.id,
      viewCount: sql<number>`(
        SELECT COUNT(*)::int
        FROM article_views
        WHERE article_views.article_id = articles.id
      )`,
      likesCount: sql<number>`(
        SELECT COUNT(*)::int
        FROM article_likes
        WHERE article_likes.article_id = articles.id
      )`,
    })
    .from(articles)
    .where(inArray(articles.id, articleIds));

  const countMap = new Map(counts.map((c) => [c.articleId, { viewCount: c.viewCount, likesCount: c.likesCount }]));

  return relatedRows.map((a) => {
    const c = countMap.get(a.id);
    return {
      ...a,
      viewCount: c?.viewCount ?? 0,
      likesCount: c?.likesCount ?? 0,
    };
  });
}
