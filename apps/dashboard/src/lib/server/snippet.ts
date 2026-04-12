import { createServerFn } from '@tanstack/react-start';
import { snippetService } from '@xbrk/api';
import { CreateSnippetSchema, UpdateSnippetSchema } from '@xbrk/db/schema';
import { z } from 'zod/v4';
import { adminMiddleware, authMiddleware } from '@/lib/auth/middleware';
import { auditMiddleware } from '@/lib/middleware/audit';
import { dbMiddleware } from '@/lib/middleware/db';
import { sentryMiddleware } from '@/lib/middleware/sentry';

const MW = [sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware, auditMiddleware];

export const $getAllSnippets = createServerFn({ method: 'GET' })
  .middleware(MW)
  .handler(({ context }) => snippetService.getAll(context.db));

export const $getSnippetById = createServerFn({ method: 'GET' })
  .middleware(MW)
  .inputValidator(z.object({ id: z.string() }))
  .handler((ctx) => snippetService.getById(ctx.context.db, ctx.data));

export const $createSnippet = createServerFn({ method: 'POST' })
  .middleware(MW)
  .inputValidator(CreateSnippetSchema)
  .handler(async (ctx) => {
    const result = await snippetService.create(ctx.context.db, ctx.data);
    await ctx.context.audit('snippet.create', 'snippet', result.id, { title: result.title });
    return result;
  });

export const $updateSnippet = createServerFn({ method: 'POST' })
  .middleware(MW)
  .inputValidator(UpdateSnippetSchema)
  .handler(async (ctx) => {
    const result = await snippetService.update(ctx.context.db, ctx.data);
    await ctx.context.audit('snippet.update', 'snippet', result.id, { title: result.title });
    return result;
  });

export const $deleteSnippet = createServerFn({ method: 'POST' })
  .middleware(MW)
  .inputValidator(z.string())
  .handler(async (ctx) => {
    const result = await snippetService.remove(ctx.context.db, ctx.data);
    await ctx.context.audit('snippet.delete', 'snippet', ctx.data);
    return result;
  });
