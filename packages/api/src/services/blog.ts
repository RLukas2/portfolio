import { createHash } from 'node:crypto';
// biome-ignore lint/performance/noNamespaceImport: Sentry SDK requires namespace import
import * as Sentry from '@sentry/node';
import type { db as DB } from '@xbrk/db/client';
import {
  articleLikes,
  articles,
  articleViews,
  type CreateArticleSchema,
  type UpdateArticleSchema,
} from '@xbrk/db/schema';
import { getTOC } from '@xbrk/utils';
import { and, desc, eq, sql } from 'drizzle-orm';
import type { z } from 'zod/v4';
import { env } from '../../env';
import { deleteFile, uploadImage } from '../storage';

type DbClient = typeof DB;

/** Extracts and hashes the requester's IP address for anonymous identity tracking. */
function hashIpAddress(headers: Headers): string {
  const ipAddress =
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    headers.get('cf-connecting-ip') ||
    '0.0.0.0';

  return createHash('sha512')
    .update(ipAddress + env.IP_ADDRESS_SALT, 'utf8')
    .digest('hex');
}

/** Returns all articles including drafts. For admin use only. */
export async function getAll(db: DbClient) {
  try {
    return await db.query.articles.findMany({
      orderBy: desc(articles.id),
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error('[blog.getAll] Database error:', error);
    return [];
  }
}

/** Returns all published articles with aggregated likes and view counts. */
export async function getAllPublic(db: DbClient) {
  try {
    const result = await db
      .select({
        id: articles.id,
        title: articles.title,
        slug: articles.slug,
        description: articles.description,
        imageUrl: articles.imageUrl,
        createdAt: articles.createdAt,
        updatedAt: articles.updatedAt,
        isDraft: articles.isDraft,
        authorId: articles.authorId,
        content: articles.content,
        tags: articles.tags,
        likesCount: sql<number>`(
          SELECT COUNT(*)::int 
          FROM article_likes 
          WHERE article_likes.article_id = articles.id
        )`,
        viewCount: sql<number>`(
          SELECT COUNT(*)::int 
          FROM article_views 
          WHERE article_views.article_id = articles.id
        )`,
      })
      .from(articles)
      .where(eq(articles.isDraft, false))
      .orderBy(desc(articles.createdAt));

    return result;
  } catch (error) {
    Sentry.captureException(error);
    console.error('[blog.getAllPublic] Database error:', error);
    return [];
  }
}

/**
 * Returns a single article by slug with comments, author, view count, and generated TOC.
 * Draft articles are only accessible to admins.
 * Uses optimized single query with joins instead of multiple queries.
 * @throws {Error} If article not found or is a draft and requester is not admin.
 */
export async function getBySlug(db: DbClient, input: { slug: string }, session?: { user: { role: string } } | null) {
  try {
    // Fetch article with all related data in a single optimized query
    const result = await db
      .select({
        article: articles,
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
      .where(eq(articles.slug, input.slug))
      .limit(1);

    if (!result[0]) {
      throw new Error('Article not found');
    }

    const { article, viewCount, likesCount } = result[0];

    // Check draft access
    if (article.isDraft && session?.user.role !== 'admin') {
      throw new Error('Article is not public');
    }

    // Fetch related data
    const [articleWithRelations] = await db.query.articles.findMany({
      where: eq(articles.id, article.id),
      with: {
        comments: true,
        author: true,
      },
      limit: 1,
    });

    const toc = getTOC(article.content ?? '');

    return {
      ...article,
      toc,
      viewCount,
      likesCount,
      comments: articleWithRelations?.comments ?? [],
      author: articleWithRelations?.author,
    };
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === 'Article not found' || error.message === 'Article is not public')
    ) {
      throw error;
    }
    Sentry.captureException(error);
    console.error('[blog.getBySlug] Database error:', error);
    throw new Error('Failed to fetch article');
  }
}

/** Returns a single article by ID. */
export async function getById(db: DbClient, input: { id: string }) {
  try {
    return await db.query.articles.findFirst({
      where: eq(articles.id, input.id),
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error('[blog.getById] Database error:', error);
    return undefined;
  }
}

/**
 * Creates a new article. If a thumbnail is provided (base64 or URL),
 * it will be uploaded to storage and the resulting URL saved to `imageUrl`.
 */
export function create(db: DbClient, input: z.infer<typeof CreateArticleSchema>) {
  const { thumbnail, ...articleData } = input;

  return (async () => {
    if (thumbnail) {
      try {
        const imageUrl = await uploadImage('articles', thumbnail, input.slug);
        articleData.imageUrl = imageUrl;
      } catch (error) {
        Sentry.captureException(error);
      }
    }

    const [created] = await db.insert(articles).values(articleData).returning();
    return created;
  })();
}

/**
 * Updates an article. If a new thumbnail is provided, uploads it and deletes the old one.
 * Old image is only deleted after the new upload succeeds.
 */
export function update(db: DbClient, input: z.infer<typeof UpdateArticleSchema>) {
  const { thumbnail, id, ...articleData } = input;

  return db.transaction(async (tx) => {
    if (thumbnail) {
      try {
        const existingArticle = await tx.query.articles.findFirst({
          where: eq(articles.id, id),
        });
        const oldImageUrl = existingArticle?.imageUrl;

        const imageUrl = await uploadImage('articles', thumbnail, input.slug ?? id);
        articleData.imageUrl = imageUrl;

        if (oldImageUrl) {
          await deleteFile(oldImageUrl);
        }
      } catch (error) {
        Sentry.captureException(error);
      }
    }

    const [updated] = await tx.update(articles).set(articleData).where(eq(articles.id, id)).returning();
    if (!updated) {
      throw new Error('Article not found');
    }
    return updated;
  });
}

/** Deletes an article and its associated image from storage if present. */
export function remove(db: DbClient, id: string) {
  return db.transaction(async (tx) => {
    const articleToDelete = await tx.query.articles.findFirst({
      where: eq(articles.id, id),
    });

    await tx.delete(articles).where(eq(articles.id, id));

    if (articleToDelete?.imageUrl) {
      try {
        await deleteFile(articleToDelete.imageUrl);
      } catch (error) {
        Sentry.captureException(error);
        console.error('[blog.remove] Image deletion failed:', error);
      }
    }
  });
}

/**
 * Toggles a like on an article using an anonymous identity derived from the requester's IP address.
 * The IP is hashed with SHA-512 + a salt to protect privacy — the original IP is never stored.
 * Does not require authentication. If a like already exists for this session, it is removed (unlike).
 * @throws {Error} If article not found or is a draft and requester is not admin.
 */
export async function like(
  db: DbClient,
  input: { slug: string },
  headers: Headers,
  session?: { user: { role: string } } | null,
): Promise<void> {
  try {
    const article = await db.query.articles.findFirst({
      where: eq(articles.slug, input.slug),
    });

    if (!article) {
      throw new Error('Article not found');
    }

    // if article is draft, throw an error unless user is admin
    if (article.isDraft && session?.user.role !== 'admin') {
      throw new Error('Article is not public');
    }

    // Extract IP address from headers
    const currentUserId = hashIpAddress(headers);

    await db.transaction(async (tx) => {
      const existingLike = await tx.query.articleLikes.findFirst({
        where: and(eq(articleLikes.articleId, article.id), eq(articleLikes.visitorId, currentUserId)),
      });

      // if like exists, delete it
      if (existingLike) {
        await tx
          .delete(articleLikes)
          .where(and(eq(articleLikes.articleId, article.id), eq(articleLikes.visitorId, currentUserId)));
        return;
      }

      // if like does not exist, insert it
      await tx.insert(articleLikes).values({
        articleId: article.id,
        visitorId: currentUserId,
      });
    });
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === 'Article not found' || error.message === 'Article is not public')
    ) {
      throw error;
    }
    Sentry.captureException(error);
    console.error('[blog.like] Database error:', error);
    throw new Error('Failed to toggle like');
  }
}

/**
 * Checks whether the current requester (identified by hashed IP) has liked a given article.
 * Uses the same IP hashing logic as `like()`.
 */
export async function isLiked(db: DbClient, input: { slug: string }, headers: Headers): Promise<boolean> {
  try {
    const article = await db.query.articles.findFirst({
      where: eq(articles.slug, input.slug),
    });

    if (!article) {
      return false;
    }

    const currentUserId = hashIpAddress(headers);

    const existingLike = await db.query.articleLikes.findFirst({
      where: and(eq(articleLikes.articleId, article.id), eq(articleLikes.visitorId, currentUserId)),
    });

    return Boolean(existingLike);
  } catch (error) {
    Sentry.captureException(error);
    console.error('[blog.isLiked] Database error:', error);
    return false;
  }
}

/**
 * Records a view for an article. Each call inserts one row into `article_views`.
 * Draft articles cannot be viewed.
 * @throws {Error} If article not found or is a draft.
 */
export async function view(db: DbClient, input: { slug: string }): Promise<void> {
  try {
    const article = await db.query.articles.findFirst({
      where: eq(articles.slug, input.slug),
    });

    if (!article) {
      throw new Error('Article not found');
    }

    // if article is draft, throw an error
    if (article.isDraft) {
      throw new Error('Article is not public');
    }

    // Insert view record with timestamp
    await db.insert(articleViews).values({
      articleId: article.id,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === 'Article not found' || error.message === 'Article is not public')
    ) {
      throw error;
    }
    Sentry.captureException(error);
    console.error('[blog.view] Database error:', error);
    throw new Error('Failed to record view');
  }
}
