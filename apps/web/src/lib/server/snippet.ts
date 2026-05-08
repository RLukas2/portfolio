import { createServerFn } from '@tanstack/react-start';
import { snippetService } from '@xbrk/api';
import { processMarkdownToHtml } from '@xbrk/md';
import { z } from 'zod/v4';
import { optionalAuthMiddleware } from '@/lib/auth/middleware';
import { dbMiddleware } from '@/lib/middleware/db';

/**
 * Server function to fetch all published code snippets.
 *
 * @returns Array of public snippets
 */
export const $getAllPublicSnippets = createServerFn({ method: 'GET' })
  .middleware([dbMiddleware])
  .handler(({ context }) => {
    return snippetService.getAllPublic(context.db);
  });

/**
 * Server function to fetch a snippet by its slug.
 * Processes markdown/code content to HTML server-side for instant rendering.
 *
 * @param slug - The snippet slug
 * @returns The snippet data with pre-rendered HTML content, or null if not found
 */
export const $getSnippetBySlug = createServerFn({ method: 'GET' })
  .middleware([dbMiddleware, optionalAuthMiddleware])
  .inputValidator(z.object({ slug: z.string() }))
  .handler(async (ctx) => {
    const session = ctx.context.user ? { user: { role: ctx.context.user.role ?? '' } } : null;
    const snippet = await snippetService.getBySlug(ctx.context.db, ctx.data, session);
    if (!snippet) {
      return null;
    }
    const renderedContent = await processMarkdownToHtml(snippet.code ?? '');
    return { ...snippet, renderedContent };
  });
