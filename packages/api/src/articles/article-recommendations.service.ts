import { articles } from '@xbrk/db/schema';
import { and, desc, eq, sql } from 'drizzle-orm';
import type { DbClient } from '../shared/db';

export async function getRelatedArticles(db: DbClient, article: { id: string; tags: string[] | null }, maxResults = 3) {
  if (!article.tags?.length) {
    return db.query.articles.findMany({
      where: and(eq(articles.isDraft, false), sql`${articles.id} != ${article.id}`),
      orderBy: desc(articles.createdAt),
      limit: maxResults,
    });
  }

  const allOtherArticles = await db.query.articles.findMany({
    where: and(eq(articles.isDraft, false), sql`${articles.id} != ${article.id}`),
    orderBy: desc(articles.createdAt),
  });

  const tagMatched = allOtherArticles
    .map((a) => ({
      article: a,
      matchCount: a.tags ? a.tags.filter((t) => article.tags?.includes(t) ?? false).length : 0,
    }))
    .filter((a) => a.matchCount > 0)
    .sort((a, b) => b.matchCount - a.matchCount)
    .slice(0, maxResults)
    .map((a) => a.article);

  if (tagMatched.length >= maxResults) {
    return tagMatched;
  }

  const existingIds = new Set(tagMatched.map((a) => a.id));
  const recentArticles = await db.query.articles.findMany({
    where: and(eq(articles.isDraft, false), sql`${articles.id} != ${article.id}`),
    orderBy: desc(articles.createdAt),
    limit: maxResults - tagMatched.length,
  });

  return [...tagMatched, ...recentArticles.filter((a) => !existingIds.has(a.id))];
}
