import { createServerFn } from '@tanstack/react-start';
import { blogService } from '@xbrk/api';
import { CreateArticleSchema, UpdateArticleSchema } from '@xbrk/db/schema';
import { z } from 'zod/v4';
import { adminMiddleware, authMiddleware } from '@/lib/auth/middleware';
import { auditMiddleware } from '@/lib/middleware/audit';
import { dbMiddleware } from '@/lib/middleware/db';
import { sentryMiddleware } from '@/lib/middleware/sentry';

const MW = [sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware, auditMiddleware];

export const $getAllArticles = createServerFn({ method: 'GET' })
  .middleware(MW)
  .handler(({ context }) => blogService.getAll(context.db));

export const $getArticleById = createServerFn({ method: 'GET' })
  .middleware(MW)
  .inputValidator(z.object({ id: z.string() }))
  .handler((ctx) => blogService.getById(ctx.context.db, ctx.data));

export const $createArticle = createServerFn({ method: 'POST' })
  .middleware(MW)
  .inputValidator(CreateArticleSchema)
  .handler(async (ctx) => {
    const result = await blogService.create(ctx.context.db, ctx.data);
    await ctx.context.audit('article.create', 'article', result.id, { title: result.title });
    return result;
  });

export const $updateArticle = createServerFn({ method: 'POST' })
  .middleware(MW)
  .inputValidator(UpdateArticleSchema)
  .handler(async (ctx) => {
    const result = await blogService.update(ctx.context.db, ctx.data);
    await ctx.context.audit('article.update', 'article', result.id, { title: result.title });
    return result;
  });

export const $deleteArticle = createServerFn({ method: 'POST' })
  .middleware(MW)
  .inputValidator(z.string())
  .handler(async (ctx) => {
    const result = await blogService.remove(ctx.context.db, ctx.data);
    await ctx.context.audit('article.delete', 'article', ctx.data);
    return result;
  });
