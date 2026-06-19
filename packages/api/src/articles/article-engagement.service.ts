import { articleLikes, articles, articleViews } from '@xbrk/db/schema';
import { InternalServerError, NotFoundError } from '@xbrk/errors';
import { and, eq, sql } from 'drizzle-orm';
import { env } from '../../env';
import type { DbClient } from '../shared/db';
import { reportError } from '../shared/errors';

async function hashIpAddress(headers: Headers): Promise<string> {
  const ipAddress =
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    headers.get('cf-connecting-ip') ||
    '0.0.0.0';

  const encoder = new TextEncoder();
  const data = encoder.encode(ipAddress + env.IP_ADDRESS_SALT);
  const hashBuffer = await crypto.subtle.digest('SHA-512', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function like(
  db: DbClient,
  input: { slug: string },
  headers: Headers,
  session?: { user: { role: string } } | null,
): Promise<void> {
  try {
    const query = db.query.articles
      .findFirst({
        where: eq(articles.slug, sql.placeholder('slug')),
      })
      .prepare('get_article_by_slug');
    const article = await query.execute({ slug: input.slug });

    if (!article) {
      throw new NotFoundError('Article not found');
    }

    if (article.isDraft && session?.user.role !== 'admin') {
      throw new NotFoundError('Article is not public');
    }

    const currentUserId = await hashIpAddress(headers);

    await db.transaction(async (tx) => {
      const existingLike = await tx.query.articleLikes.findFirst({
        where: and(eq(articleLikes.articleId, article.id), eq(articleLikes.visitorId, currentUserId)),
      });

      if (existingLike) {
        await tx
          .delete(articleLikes)
          .where(and(eq(articleLikes.articleId, article.id), eq(articleLikes.visitorId, currentUserId)));
        return;
      }

      await tx.insert(articleLikes).values({
        articleId: article.id,
        visitorId: currentUserId,
      });
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    reportError('article-engagement.like', error);
    throw new InternalServerError('Failed to toggle like');
  }
}

export async function isLiked(db: DbClient, input: { slug: string }, headers: Headers): Promise<boolean> {
  try {
    const query = db.query.articles
      .findFirst({
        where: eq(articles.slug, sql.placeholder('slug')),
      })
      .prepare('get_article_by_slug');
    const article = await query.execute({ slug: input.slug });

    if (!article) {
      return false;
    }

    const currentUserId = await hashIpAddress(headers);

    const existingLike = await db.query.articleLikes.findFirst({
      where: and(eq(articleLikes.articleId, article.id), eq(articleLikes.visitorId, currentUserId)),
    });

    return Boolean(existingLike);
  } catch (error) {
    reportError('article-engagement.isLiked', error);
    return false;
  }
}

export async function view(db: DbClient, input: { slug: string }): Promise<{ viewCount: number }> {
  try {
    const query = db.query.articles
      .findFirst({
        where: eq(articles.slug, sql.placeholder('slug')),
      })
      .prepare('get_article_by_slug');
    const article = await query.execute({ slug: input.slug });

    if (!article) {
      throw new NotFoundError('Article not found');
    }

    if (article.isDraft) {
      throw new NotFoundError('Article is not public');
    }

    await db.insert(articleViews).values({
      articleId: article.id,
    });

    const [result] = await db
      .select({
        viewCount: sql<number>`COUNT(*)::int`,
      })
      .from(articleViews)
      .where(eq(articleViews.articleId, article.id));

    return { viewCount: result?.viewCount ?? 0 };
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    reportError('article-engagement.view', error);
    throw new InternalServerError('Failed to record view');
  }
}
