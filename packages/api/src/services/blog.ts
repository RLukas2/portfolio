import { createHash } from 'node:crypto';
import type { db as DB } from '@xbrk/db/client';
import {
  articleLikes,
  articles,
  articleViews,
  type CreateArticleSchema,
  type UpdateArticleSchema,
} from '@xbrk/db/schema';
import { getTOC } from '@xbrk/utils';
import { desc, eq, sql } from 'drizzle-orm';
import type { z } from 'zod/v4';
import { env } from '../../env';
import { deleteFile, uploadImage } from '../s3';

type DbClient = typeof DB;

/** Returns all articles including drafts. For admin use only. */
export function getAll(db: DbClient) {
  return db.query.articles.findMany({
    orderBy: desc(articles.id),
  });
}

/** Returns all published articles with aggregated view count via LEFT JOIN on `article_views`. */
export async function getAllPublic(db: DbClient) {
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
      viewCount: sql<number>`count(${articleViews.id})`.as('view_count'),
    })
    .from(articles)
    .leftJoin(articleViews, eq(articles.id, articleViews.articleId))
    .where(eq(articles.isDraft, false))
    .groupBy(articles.id)
    .orderBy(desc(articles.createdAt));

  return result;
}

/**
 * Returns a single article by slug with comments, author, view count, and generated TOC.
 * Draft articles are only accessible to admins.
 * @throws {Error} If article not found or is a draft and requester is not admin.
 */
export async function getBySlug(db: DbClient, input: { slug: string }, session?: { user: { role: string } } | null) {
  const article = await db.query.articles.findFirst({
    where: eq(articles.slug, input.slug),
    with: {
      comments: true,
      author: true,
    },
  });

  if (!article) {
    throw new Error('Article not found');
  }

  // if article is draft, throw an error unless user is admin
  if (article.isDraft && session?.user.role !== 'admin') {
    throw new Error('Article is not public');
  }

  // Get view count separately
  const viewCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(articleViews)
    .where(eq(articleViews.articleId, article.id));

  const toc = getTOC(article.content ?? '');

  return { ...article, toc, viewCount: viewCount[0]?.count ?? 0 };
}

/** Returns a single article by ID. Returns `undefined` if not found. */
export function getById(db: DbClient, input: { id: string }) {
  return db.query.articles.findFirst({
    where: eq(articles.id, input.id),
  });
}

/**
 * Creates a new article. If a thumbnail is provided (base64 or URL),
 * it will be uploaded to storage and the resulting URL saved to `imageUrl`.
 */
export async function create(db: DbClient, input: z.infer<typeof CreateArticleSchema>) {
  const { thumbnail, ...articleData } = input;

  if (thumbnail) {
    try {
      const imageUrl = await uploadImage('articles', thumbnail, input.slug);
      articleData.imageUrl = imageUrl;
    } catch (error) {
      console.error(error);
    }
  }

  return db.insert(articles).values(articleData);
}

/**
 * Updates an article. If a new thumbnail is provided, uploads it and deletes the old one.
 * Old image is only deleted after the new upload succeeds.
 */
export async function update(db: DbClient, input: z.infer<typeof UpdateArticleSchema>) {
  const { thumbnail, id, ...articleData } = input;

  if (thumbnail) {
    try {
      const existingArticle = await db.query.articles.findFirst({
        where: eq(articles.id, id),
      });
      const oldImageUrl = existingArticle?.imageUrl;

      const imageUrl = await uploadImage('articles', thumbnail, input.slug ?? id);
      articleData.imageUrl = imageUrl;

      if (oldImageUrl) {
        await deleteFile(oldImageUrl);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return db.update(articles).set(articleData).where(eq(articles.id, id));
}

/** Deletes an article and its associated image from storage if present. */
export async function remove(db: DbClient, id: string) {
  const articleToDelete = await db.query.articles.findFirst({
    where: eq(articles.id, id),
  });

  if (articleToDelete?.imageUrl) {
    await deleteFile(articleToDelete.imageUrl);
  }

  return db.delete(articles).where(eq(articles.id, id));
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
) {
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
  const ipAddress =
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    headers.get('cf-connecting-ip') ||
    // Fallback for localhost or non Vercel deployments
    '0.0.0.0';

  const currentUserId =
    // Since a users IP address is part of the sessionId in our database, we
    // hash it to protect their privacy. By combining it with a salt, we get
    // get a unique id we can refer to, but we won't know what their ip
    // address was.
    createHash('sha512')
      .update(ipAddress + env.IP_ADDRESS_SALT, 'utf8')
      .digest('hex');

  const sessionId = `${input.slug}_${currentUserId}`;

  const existingLike = await db.query.articleLikes.findFirst({
    where: eq(articleLikes.id, sessionId),
  });

  // if like exists, delete it
  if (existingLike) {
    await db.delete(articleLikes).where(eq(articleLikes.id, sessionId));
    return;
  }

  // if like does not exist, insert it
  return db.insert(articleLikes).values({
    articleId: article.id,
    userId: currentUserId,
  });
}

/**
 * Checks whether the current requester (identified by hashed IP) has liked a given article.
 * Uses the same IP hashing logic as `like()`.
 */
export async function isLiked(db: DbClient, input: { slug: string }, headers: Headers) {
  // Extract IP address from headers (same logic as in like mutation)
  const ipAddress =
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    headers.get('cf-connecting-ip') ||
    '0.0.0.0';

  const currentUserId = createHash('sha512')
    .update(ipAddress + (env.IP_ADDRESS_SALT || 'fallback-salt'), 'utf8')
    .digest('hex');

  const sessionId = `${input.slug}_${currentUserId}`;

  const existingLike = await db.query.articleLikes.findFirst({
    where: eq(articleLikes.id, sessionId),
  });

  return Boolean(existingLike);
}

/**
 * Records a view for an article. Each call inserts one row into `article_views`.
 * Draft articles cannot be viewed.
 * @throws {Error} If article not found or is a draft.
 */
export async function view(db: DbClient, input: { slug: string }) {
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
  return db.insert(articleViews).values({
    articleId: article.id,
  });
}
