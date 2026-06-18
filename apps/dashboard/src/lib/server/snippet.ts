import { createServerFn } from '@tanstack/react-start';
import { snippetsService } from '@xbrk/api';
import { CreateSnippetSchema, UpdateSnippetSchema } from '@xbrk/db/api-schemas';
import { z } from 'zod/v4';
import { adminServerMiddleware } from '@/lib/middleware/admin-server';

export const $getAllSnippets = createServerFn({ method: 'GET' })
  .middleware(adminServerMiddleware)
  .handler(({ context }) => {
    return snippetsService.getAll(context.db);
  });

export const $getSnippetById = createServerFn({ method: 'GET' })
  .middleware(adminServerMiddleware)
  .inputValidator(z.object({ id: z.string() }))
  .handler((ctx) => {
    return snippetsService.getById(ctx.context.db, ctx.data);
  });

export const $createSnippet = createServerFn({ method: 'POST' })
  .middleware(adminServerMiddleware)
  .inputValidator(CreateSnippetSchema)
  .handler((ctx) => {
    return snippetsService.create(ctx.context.db, ctx.data);
  });

export const $updateSnippet = createServerFn({ method: 'POST' })
  .middleware(adminServerMiddleware)
  .inputValidator(UpdateSnippetSchema)
  .handler((ctx) => {
    return snippetsService.update(ctx.context.db, ctx.data);
  });

export const $deleteSnippet = createServerFn({ method: 'POST' })
  .middleware(adminServerMiddleware)
  .inputValidator(z.string())
  .handler((ctx) => {
    return snippetsService.remove(ctx.context.db, ctx.data);
  });
