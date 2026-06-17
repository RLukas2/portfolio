import { type CreateArticleSchema, type UpdateArticleSchema } from '@xbrk/db/api-schemas';
import { articles } from '@xbrk/db/schema';
import { HttpError, InternalServerError, NotFoundError } from '@xbrk/errors';
import { getTOCFromHast } from '@xbrk/md/processor';
import { desc, eq, sql } from 'drizzle-orm';
import type { z } from 'zod/v4';
import type { DbClient } from '../shared/db';
import { reportError } from '../shared/errors';
import { buildContentRendering } from '../shared/markdown-rendering';
import { deleteFile, uploadImage } from '../storage/blob-storage';
import { getRelatedArticles } from './article-recommendations.service';

export async function getAll(db: DbClient) {
  try {
    return await db.query.articles.findMany({
      orderBy: desc(articles.id),
    });
  } catch (error) {
    reportError('articles.getAll', error);
    return [];
  }
}

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
        contentRendering: articles.contentRendering,
        contentRenderingVersion: articles.contentRenderingVersion,
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
    reportError('articles.getAllPublic', error);
    return [];
  }
}

export async function getBySlug(db: DbClient, input: { slug: string }, session?: { user: { role: string } } | null) {
  try {
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
      throw new NotFoundError('Article not found');
    }

    const { article, viewCount, likesCount } = result[0];

    if (article.isDraft && session?.user.role !== 'admin') {
      throw new NotFoundError('Article is not public');
    }

    const [articleWithRelations] = await db.query.articles.findMany({
      where: eq(articles.id, article.id),
      with: {
        comments: true,
        author: true,
      },
      limit: 1,
    });

    const toc = getTOCFromHast(article.contentRendering);
    const relatedArticles = await getRelatedArticles(db, article);

    return {
      ...article,
      toc,
      viewCount,
      likesCount,
      comments: articleWithRelations?.comments ?? [],
      author: articleWithRelations?.author,
      relatedArticles,
    };
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    reportError('articles.getBySlug', error);
    throw new InternalServerError('Failed to fetch article');
  }
}

export async function getById(db: DbClient, input: { id: string }) {
  try {
    const query = db.query.articles
      .findFirst({
        where: eq(articles.id, sql.placeholder('id')),
      })
      .prepare('get_article_by_id');
    return await query.execute({ id: input.id });
  } catch (error) {
    reportError('articles.getById', error);
    return undefined;
  }
}

export async function create(db: DbClient, input: z.infer<typeof CreateArticleSchema>) {
  const { thumbnail, ...articleData } = input;

  let uploadedUrl: string | undefined;
  if (thumbnail) {
    try {
      uploadedUrl = await uploadImage('articles', thumbnail, input.slug);
      articleData.imageUrl = uploadedUrl;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      reportError('articles.create', error);
    }
  }

  const { contentRendering, contentRenderingVersion } = await buildContentRendering(articleData.content);

  try {
    return await db.insert(articles).values({
      ...articleData,
      contentRendering,
      contentRenderingVersion,
    });
  } catch (error) {
    if (uploadedUrl) {
      try {
        await deleteFile(uploadedUrl);
      } catch {
        // cleanup orphan blob on insert failure
      }
    }
    throw error;
  }
}

export async function update(db: DbClient, input: z.infer<typeof UpdateArticleSchema>) {
  const { thumbnail, id, ...articleData } = input;

  let oldImageUrl: string | null | undefined;
  if (thumbnail) {
    try {
      const existingArticle = await db.query.articles.findFirst({
        where: eq(articles.id, id),
      });
      if (!existingArticle) {
        throw new NotFoundError('Article not found');
      }
      oldImageUrl = existingArticle.imageUrl;

      const imageUrl = await uploadImage('articles', thumbnail, input.slug ?? id);
      articleData.imageUrl = imageUrl;
    } catch (error) {
      reportError('articles.update', error);
    }
  }

  const setData: Record<string, unknown> = { ...articleData };

  if (articleData.content !== undefined) {
    const { contentRendering, contentRenderingVersion: version } = await buildContentRendering(articleData.content);
    setData.contentRendering = contentRendering;
    setData.contentRenderingVersion = version;
  }

  await db.update(articles).set(setData).where(eq(articles.id, id));

  // Best-effort delete old image after DB update succeeds
  if (oldImageUrl) {
    try {
      await deleteFile(oldImageUrl);
    } catch (error) {
      reportError('articles.update', error);
    }
  }
}

export async function remove(db: DbClient, id: string) {
  const articleToDelete = await db.query.articles.findFirst({
    where: eq(articles.id, id),
  });

  if (!articleToDelete) {
    throw new NotFoundError('Article not found');
  }

  await db.delete(articles).where(eq(articles.id, id));

  if (articleToDelete.imageUrl) {
    try {
      await deleteFile(articleToDelete.imageUrl);
    } catch (error) {
      reportError('articles.remove', error);
    }
  }
}
