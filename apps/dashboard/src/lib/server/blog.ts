import { createServerFn } from '@tanstack/react-start';
import { articlesService } from '@xbrk/api';
import { ArticleBaseSchema, UpdateArticleSchema } from '@xbrk/db/api-schemas';
import { z } from 'zod/v4';
import { adminServerMiddleware } from '@/lib/middleware/admin-server';

export const $getAllArticles = createServerFn({ method: 'GET' })
  .middleware(adminServerMiddleware)
  .handler(({ context }) => {
    return articlesService.getAll(context.db);
  });

export const $getArticleById = createServerFn({ method: 'GET' })
  .middleware(adminServerMiddleware)
  .inputValidator(z.object({ id: z.string() }))
  .handler((ctx) => {
    return articlesService.getById(ctx.context.db, ctx.data);
  });

export const $createArticle = createServerFn({ method: 'POST' })
  .middleware(adminServerMiddleware)
  .inputValidator(ArticleBaseSchema)
  .handler((ctx) => {
    return articlesService.create(ctx.context.db, {
      ...ctx.data,
      authorId: ctx.context.user.id,
    });
  });

export const $updateArticle = createServerFn({ method: 'POST' })
  .middleware(adminServerMiddleware)
  .inputValidator(UpdateArticleSchema)
  .handler((ctx) => {
    return articlesService.update(ctx.context.db, ctx.data);
  });

export const $deleteArticle = createServerFn({ method: 'POST' })
  .middleware(adminServerMiddleware)
  .inputValidator(z.string())
  .handler((ctx) => {
    return articlesService.remove(ctx.context.db, ctx.data);
  });
