import { createServerFn } from '@tanstack/react-start';
import { snippetService } from '@xbrk/api';
import { CreateSnippetSchema, UpdateSnippetSchema } from '@xbrk/db/schema';
import { z } from 'zod/v4';
import { adminMiddleware, authMiddleware } from '@/lib/auth/middleware';
import { dbMiddleware } from '@/lib/middleware/db';
import { sentryMiddleware } from '@/lib/middleware/sentry';

export const $getAllSnippets = createServerFn({ method: 'GET' })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware])
  .handler(({ context }) => {
    return snippetService.getAll(context.db);
  });

export const $getSnippetById = createServerFn({ method: 'GET' })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware])
  .inputValidator(z.object({ id: z.string() }))
  .handler((ctx) => {
    return snippetService.getById(ctx.context.db, ctx.data);
  });

export const $createSnippet = createServerFn({ method: 'POST' })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware])
  .inputValidator(CreateSnippetSchema)
  .handler((ctx) => {
    return snippetService.create(ctx.context.db, ctx.data);
  });

export const $updateSnippet = createServerFn({ method: 'POST' })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware])
  .inputValidator(UpdateSnippetSchema)
  .handler((ctx) => {
    return snippetService.update(ctx.context.db, ctx.data);
  });

export const $deleteSnippet = createServerFn({ method: 'POST' })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware])
  .inputValidator(z.string())
  .handler((ctx) => {
    return snippetService.remove(ctx.context.db, ctx.data);
  });
