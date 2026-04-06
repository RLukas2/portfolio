// biome-ignore lint/performance/noNamespaceImport: Sentry SDK requires namespace import
import * as Sentry from '@sentry/node';
import type { db as DB } from '@xbrk/db/client';
import { commentReactions, comments, user } from '@xbrk/db/schema';
import { and, asc, desc, eq, isNull, sql } from 'drizzle-orm';
import { z } from 'zod/v4';

type DbClient = typeof DB;

const baseJSONContent = z.object({
  type: z.string().optional(),
  attrs: z.record(z.any(), z.any()).optional(),
  marks: z
    .array(
      z.object({
        type: z.string(),
        attrs: z.record(z.any(), z.any()).optional(),
      }),
    )
    .optional(),
  text: z.string().optional(),
});

/** Recursive Zod schema for TipTap/ProseMirror JSON content nodes. */
export const JSONContentSchema: z.ZodType<z.infer<typeof baseJSONContent>> = baseJSONContent.extend({
  content: z.array(z.lazy(() => JSONContentSchema)).optional(),
});

/** Creates a new comment on an article. Supports nested replies via `parentId`. */
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
    Sentry.captureException(error);
    console.error('[comment.create] Database error:', error);
    throw new Error('Failed to create comment');
  }
}

/**
 * Returns top-level comments (or replies if `parentId` is provided) for an article.
 * Includes reply count, like/dislike counts, and the current user's reaction via optimized joins.
 */
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
    Sentry.captureException(error);
    console.error('[comment.getAll] Database error:', error);
    return [];
  }
}

/**
 * Deletes a comment and all its nested replies. Only the comment owner or an admin can delete.
 * Uses transaction to ensure consistency.
 * @throws {Error} If comment not found or requester lacks permission.
 */
export async function remove(db: DbClient, input: { id: string }, userId: string, userRole: string): Promise<void> {
  try {
    await db.transaction(async (tx) => {
      const comment = await tx.query.comments.findFirst({
        where: eq(comments.id, input.id),
      });

      if (!comment) {
        throw new Error('Comment not found');
      }

      if (comment.userId !== userId && userRole !== 'admin') {
        throw new Error('You are not allowed to delete this comment');
      }

      // Delete child comments first (replies) to avoid foreign key constraint violation
      await tx.delete(comments).where(eq(comments.parentId, input.id));

      // Then delete the parent comment
      await tx.delete(comments).where(eq(comments.id, input.id));
    });
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === 'Comment not found' || error.message === 'You are not allowed to delete this comment')
    ) {
      throw error;
    }
    Sentry.captureException(error);
    console.error('[comment.remove] Database error:', error);
    throw new Error('Failed to delete comment');
  }
}

/**
 * Adds or updates a like/dislike reaction on a comment.
 * (Optional) Users cannot react to their own comments.
 * If a reaction already exists, it is updated in place.
 * Uses transaction to ensure consistency.
 * @throws {Error} If comment not found or user tries to react to their own comment.
 */
export async function react(db: DbClient, input: { id: string; like: boolean }, userId: string): Promise<void> {
  try {
    await db.transaction(async (tx) => {
      const comment = await tx.query.comments.findFirst({
        where: eq(comments.id, input.id),
      });

      if (!comment) {
        throw new Error('Comment not found');
      }

      // if (comment.userId === userId) {
      //   throw new Error('You are not allowed to react to your own comment');
      // }

      const existingReaction = await tx.query.commentReactions.findFirst({
        where: and(eq(commentReactions.commentId, input.id), eq(commentReactions.userId, userId)),
      });

      if (existingReaction) {
        await tx.update(commentReactions).set({ like: input.like }).where(eq(commentReactions.id, existingReaction.id));
      } else {
        await tx.insert(commentReactions).values({
          commentId: input.id,
          userId,
          like: input.like,
        });
      }
    });
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === 'Comment not found' || error.message === 'You are not allowed to react to your own comment')
    ) {
      throw error;
    }
    Sentry.captureException(error);
    console.error('[comment.react] Database error:', error);
    throw new Error('Failed to react to comment');
  }
}
