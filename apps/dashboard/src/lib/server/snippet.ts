import { createServerFn } from '@tanstack/react-start';
import { snippetService } from '@xbrk/api';
import { CreateSnippetSchema, UpdateSnippetSchema } from '@xbrk/db/schema';
import { z } from 'zod/v4';
import { adminMiddleware, authMiddleware } from '@/lib/auth/middleware';
import { auditMiddleware } from '@/lib/middleware/audit';
import { dbMiddleware } from '@/lib/middleware/db';
import { sentryMiddleware } from '@/lib/middleware/sentry';

export const $getAllSnippets = createServerFn({ method: 'GET' })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware, auditMiddleware])
  .handler(({ context }) => snippetService.getAll(context.db));

export const $getSnippetById = createServerFn({ method: 'GET' })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware, auditMiddleware])
  .inputValidator(z.object({ id: z.string() }))
  .handler(({ context, data }) => snippetService.getById(context.db, data));

export const $createSnippet = createServerFn({ method: 'POST' })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware, auditMiddleware])
  .inputValidator(CreateSnippetSchema)
  .handler(async ({ context, data }) => {
    const result = await snippetService.create(context.db, data);
    context.audit('snippet.create', 'snippet', result?.id, { title: result?.title });
    return result;
  });

export const $updateSnippet = createServerFn({ method: 'POST' })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware, auditMiddleware])
  .inputValidator(UpdateSnippetSchema)
  .handler(async ({ context, data }) => {
    const result = await snippetService.update(context.db, data);
    context.audit('snippet.update', 'snippet', result?.id, { title: result?.title });
    return result;
  });

export const $deleteSnippet = createServerFn({ method: 'POST' })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware, auditMiddleware])
  .inputValidator(z.string())
  .handler(async ({ context, data }) => {
    const result = await snippetService.remove(context.db, data);
    context.audit('snippet.delete', 'snippet', data);
    return result;
  });
