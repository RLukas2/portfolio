import { createServerFn } from '@tanstack/react-start';
import { articlesService } from '@xbrk/api';
import { CreateArticleSchema, UpdateArticleSchema } from '@xbrk/db/api-schemas';
import { z } from 'zod/v4';
import { adminMiddleware, authMiddleware } from '@/lib/auth/middleware';
import { dbMiddleware } from '@/lib/middleware/db';
import { sentryMiddleware } from '@/lib/middleware/sentry';

export const $getAllArticles = createServerFn({ method: 'GET' })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware])
  .handler(({ context }) => {
    return articlesService.getAll(context.db);
  });

export const $getArticleById = createServerFn({ method: 'GET' })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware])
  .inputValidator(z.object({ id: z.string() }))
  .handler((ctx) => {
    return articlesService.getById(ctx.context.db, ctx.data);
  });

export const $createArticle = createServerFn({ method: 'POST' })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware])
  .inputValidator(CreateArticleSchema)
  .handler((ctx) => {
    return articlesService.create(ctx.context.db, ctx.data);
  });

export const $updateArticle = createServerFn({ method: 'POST' })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware])
  .inputValidator(UpdateArticleSchema)
  .handler((ctx) => {
    return articlesService.update(ctx.context.db, ctx.data);
  });

export const $deleteArticle = createServerFn({ method: 'POST' })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware])
  .inputValidator(z.string())
  .handler((ctx) => {
    return articlesService.remove(ctx.context.db, ctx.data);
  });
