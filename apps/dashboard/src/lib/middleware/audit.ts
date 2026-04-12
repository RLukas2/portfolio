import { createMiddleware } from '@tanstack/react-start';
import { createAuditor } from '@xbrk/api';

/**
 * Audit Middleware
 *
 * Injects a bound `audit()` helper into the request context.
 * Must be placed after both `dbMiddleware` and `authMiddleware` in the chain
 * so that `context.db` and `context.user` are already available.
 *
 * Usage in a server function handler:
 * ```ts
 * .handler(async (ctx) => {
 *   const result = await someService.create(ctx.context.db, ctx.data);
 *   await ctx.context.audit('article.create', 'article', result.id, { title: result.title });
 *   return result;
 * });
 * ```
 */
export const auditMiddleware = createMiddleware().server(({ next, context }) => {
  const ctx = context as unknown as Record<string, unknown>;
  const db = ctx.db as Parameters<typeof createAuditor>[0];
  const user = ctx.user as { id: string } | undefined;

  // Gracefully degrade if db/user aren't in context yet (shouldn't happen in normal usage)
  const audit = user ? createAuditor(db, user.id) : () => Promise.resolve();

  return next({ context: { audit } });
});
