import { randomUUID } from 'node:crypto';
import { createMiddleware } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import { createAuditor } from '@xbrk/api';

/**
 * Audit Middleware
 *
 * Injects a bound `audit()` helper into the request context.
 * Must be placed after both `dbMiddleware` and `authMiddleware` in the chain
 * so that `context.db` and `context.user` are already available.
 *
 * Automatically captures:
 * - Client IP address (respecting Cloudflare, reverse proxies, and direct connections)
 * - User-agent string from the incoming request
 * - Request ID for correlating related operations (generated if not present)
 * - Session ID for tracking actions within the same session
 *
 * Gracefully degrades to a no-op if db or user are missing from context
 * (should not happen in normal usage given the middleware ordering).
 *
 * @example
 * ```ts
 * export const $createArticle = createServerFn({ method: 'POST' })
 *   .middleware([sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware, auditMiddleware])
 *   .handler(async ({ context, data }) => {
 *     const result = await blogService.create(context.db, data);
 *     context.audit('article.create', 'article', result.id, { after: result });
 *     return result;
 *   });
 * ```
 */

// Regex for extracting session token from cookie header
const SESSION_TOKEN_REGEX = /better-auth\.session_token=([^;]+)/;

export const auditMiddleware = createMiddleware().server(({ next, context }) => {
  const ctx = context as unknown as Record<string, unknown>;
  const db = ctx.db as Parameters<typeof createAuditor>[0];
  const user = ctx.user as { id: string } | undefined;

  const request = getRequest();
  const ipAddress =
    request.headers.get('cf-connecting-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    undefined;
  const userAgent = request.headers.get('user-agent') ?? undefined;

  // Generate or extract request ID for correlation
  const requestId = request.headers.get('x-request-id') ?? randomUUID();

  // Extract session ID from cookie (Better Auth session token)
  const cookieHeader = request.headers.get('cookie');
  let sessionId: string | undefined;
  if (cookieHeader) {
    const sessionMatch = cookieHeader.match(SESSION_TOKEN_REGEX);
    sessionId = sessionMatch?.[1];
  }

  const audit =
    db && user ? createAuditor(db, user.id, ipAddress, userAgent, requestId, sessionId) : () => Promise.resolve();

  return next({ context: { audit, requestId } });
});
