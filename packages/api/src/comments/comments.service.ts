import { commentReactions, comments, user } from '@xbrk/db/schema';
import { ForbiddenError, InternalServerError, NotFoundError } from '@xbrk/errors';
import { and, asc, desc, eq, inArray, isNull, sql } from 'drizzle-orm';
import type { z } from 'zod/v4';
import type { DbClient } from '../shared/db';
import { reportError } from '../shared/errors';
import type { JSONContentSchema } from './comment-content.schema';

export async function create(
  db: DbClient,
  input: {
    articleId: string;
    content: z.infer<typeof JSONContentSchema>;
    parentId?: string;
  },
  userId: string,
): Promise<void> {
  try {
    await db.insert(comments).values({
      userId,
      articleId: input.articleId,
      content: input.content,
      parentId: input.parentId,
    });
  } catch (error) {
    reportError('comments.create', error);
    throw new InternalServerError('Failed to create comment');
  }
}

export async function getAll(
  db: DbClient,
  input: {
    articleId: string;
    parentId?: string;
    sort?: 'asc' | 'desc';
  },
  userId?: string,
) {
  try {
    const sortOrder = input.sort === 'asc' ? asc(comments.createdAt) : desc(comments.createdAt);

    const commentsWithCounts = await db
      .select({
        comment: comments,
        user,
        repliesCount: sql<number>`(
          SELECT COUNT(*)::int
          FROM comments c2
          WHERE c2.parent_id = comments.id
        )`,
        likesCount: sql<number>`(
          SELECT COUNT(*)::int
          FROM comment_reactions cr
          WHERE cr.comment_id = comments.id AND cr.like = true
        )`,
        dislikesCount: sql<number>`(
          SELECT COUNT(*)::int
          FROM comment_reactions cr
          WHERE cr.comment_id = comments.id AND cr.like = false
        )`,
        userReaction: commentReactions,
      })
      .from(comments)
      .leftJoin(user, eq(comments.userId, user.id))
      .leftJoin(
        commentReactions,
        and(eq(commentReactions.commentId, comments.id), eq(commentReactions.userId, userId ?? '')),
      )
      .where(
        input.parentId
          ? and(eq(comments.articleId, input.articleId), eq(comments.parentId, input.parentId))
          : and(eq(comments.articleId, input.articleId), isNull(comments.parentId)),
      )
      .orderBy(sortOrder);

    return commentsWithCounts;
  } catch (error) {
    reportError('comments.getAll', error);
    return [];
  }
}

export async function remove(db: DbClient, input: { id: string }, userId: string, userRole: string): Promise<void> {
  try {
    const comment = await db.query.comments.findFirst({
      where: eq(comments.id, input.id),
    });

    if (!comment) {
      throw new NotFoundError('Comment not found');
    }

    if (comment.userId !== userId && userRole !== 'admin') {
      throw new ForbiddenError('You are not allowed to delete this comment');
    }

    // Collect all descendant IDs recursively
    const idsToDelete: string[] = [];
    let queue = [comment.id];
    while (queue.length > 0) {
      const children = await db.select({ id: comments.id }).from(comments).where(inArray(comments.parentId, queue));
      const childIds = children.map((c) => c.id);
      idsToDelete.push(...childIds);
      queue = childIds;
    }

    const allIds = [comment.id, ...idsToDelete];
    await db.delete(comments).where(inArray(comments.id, allIds));
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ForbiddenError) {
      throw error;
    }
    reportError('comments.remove', error);
    throw new InternalServerError('Failed to delete comment');
  }
}

export async function react(db: DbClient, input: { id: string; like: boolean }, userId: string): Promise<void> {
  try {
    const comment = await db.query.comments.findFirst({
      where: eq(comments.id, input.id),
    });

    if (!comment) {
      throw new NotFoundError('Comment not found');
    }

    const existingReaction = await db.query.commentReactions.findFirst({
      where: and(eq(commentReactions.commentId, input.id), eq(commentReactions.userId, userId)),
    });

    if (existingReaction) {
      await db.update(commentReactions).set({ like: input.like }).where(eq(commentReactions.id, existingReaction.id));
    } else {
      await db.insert(commentReactions).values({
        commentId: input.id,
        userId,
        like: input.like,
      });
    }
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ForbiddenError) {
      throw error;
    }
    reportError('comments.react', error);
    throw new InternalServerError('Failed to react to comment');
  }
}

export { JSONContentSchema } from './comment-content.schema';
