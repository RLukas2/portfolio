import { createServerFn } from '@tanstack/react-start';
import { commentService } from '@xbrk/api';
import { z } from 'zod/v4';
import { authMiddleware, optionalAuthMiddleware } from '@/lib/auth/middleware';
import { dbMiddleware } from '@/lib/middleware/db';

export const $createComment = createServerFn({ method: 'POST' })
  .middleware([dbMiddleware, authMiddleware])
  .inputValidator(
    z.object({
      articleId: z.uuid(),
      content: commentService.JSONContentSchema,
      parentId: z.string().optional(),
    }),
  )
  .handler((ctx) => {
    return commentService.create(ctx.context.db, ctx.data, ctx.context.user.id);
  });

export const $getAllComments = createServerFn({ method: 'GET' })
  .middleware([dbMiddleware, optionalAuthMiddleware])
  .inputValidator(
    z.object({
      articleId: z.uuid(),
      parentId: z.string().optional(),
      sort: z.enum(['asc', 'desc']).optional(),
    }),
  )
  .handler(
    // biome-ignore lint/suspicious/noExplicitAny: Drizzle relation types trigger serialization false positive
    (ctx): Promise<any> => {
      return commentService.getAll(ctx.context.db, ctx.data, ctx.context.user?.id);
    },
  );

export const $deleteComment = createServerFn({ method: 'POST' })
  .middleware([dbMiddleware, authMiddleware])
  .inputValidator(z.object({ id: z.string() }))
  .handler((ctx) => {
    return commentService.remove(ctx.context.db, ctx.data, ctx.context.user.id, ctx.context.user.role ?? '');
  });

export const $reactToComment = createServerFn({ method: 'POST' })
  .middleware([dbMiddleware, authMiddleware])
  .inputValidator(z.object({ id: z.string(), like: z.boolean() }))
  .handler((ctx) => {
    return commentService.react(ctx.context.db, ctx.data, ctx.context.user.id);
  });
