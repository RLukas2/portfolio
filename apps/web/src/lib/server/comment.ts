import { createServerFn } from '@tanstack/react-start';
import { commentsService } from '@xbrk/api';
import type { Comment } from '@xbrk/db';
import { z } from 'zod/v4';
import { authMiddleware, optionalAuthMiddleware } from '@/lib/auth/middleware';
import { dbMiddleware } from '@/lib/middleware/db';
import type { CommentWithRelations } from '@/types/misc';

type CommentRow = Omit<CommentWithRelations, 'comment'> & {
  comment: Omit<Comment, 'content'> & { content: Record<string, object> };
};

/**
 * Server function to create a new comment on an article.
 * Requires authentication.
 *
 * @param articleId - The article UUID
 * @param content - Comment content in JSON format
 * @param parentId - Optional parent comment ID for nested replies
 * @returns The created comment
 */
export const $createComment = createServerFn({ method: 'POST' })
  .middleware([dbMiddleware, authMiddleware])
  .inputValidator(
    z.object({
      articleId: z.uuid(),
      content: commentsService.JSONContentSchema,
      parentId: z.string().optional(),
    }),
  )
  .handler((ctx) => {
    return commentsService.create(ctx.context.db, ctx.data, ctx.context.user.id);
  });

/**
 * Server function to fetch all comments for an article.
 *
 * @param articleId - The article UUID
 * @param parentId - Optional parent comment ID to filter replies
 * @param sort - Sort order ('asc' or 'desc')
 * @returns Array of comments
 */
export const $getAllComments = createServerFn({ method: 'GET' })
  .middleware([dbMiddleware, optionalAuthMiddleware])
  .inputValidator(
    z.object({
      articleId: z.uuid(),
      parentId: z.string().optional(),
      sort: z.enum(['asc', 'desc']).optional(),
    }),
  )
  .handler((ctx): Promise<CommentRow[]> => {
    return commentsService.getAll(ctx.context.db, ctx.data, ctx.context.user?.id) as Promise<CommentRow[]>;
  });

/**
 * Server function to delete a comment.
 * Requires authentication and proper permissions.
 *
 * @param id - The comment ID
 * @returns Success status
 */
export const $deleteComment = createServerFn({ method: 'POST' })
  .middleware([dbMiddleware, authMiddleware])
  .inputValidator(z.object({ id: z.string() }))
  .handler((ctx) => {
    return commentsService.remove(ctx.context.db, ctx.data, ctx.context.user.id, ctx.context.user.role ?? '');
  });

/**
 * Server function to like/unlike a comment.
 * Requires authentication.
 *
 * @param id - The comment ID
 * @param like - Boolean indicating like (true) or unlike (false)
 * @returns Updated reaction status
 */
export const $reactToComment = createServerFn({ method: 'POST' })
  .middleware([dbMiddleware, authMiddleware])
  .inputValidator(z.object({ id: z.string(), like: z.boolean() }))
  .handler((ctx) => {
    return commentsService.react(ctx.context.db, ctx.data, ctx.context.user.id);
  });
