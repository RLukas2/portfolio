import { createServerFn } from '@tanstack/react-start';
import { searchService } from '@xbrk/api';
import { z } from 'zod/v4';
import { dbMiddleware } from '@/lib/middleware/db';

/**
 * Server function to search across blog posts, projects, and snippets.
 *
 * @param query - Search query string (1-100 characters)
 * @returns Search results grouped by content type
 */
export const $search = createServerFn({ method: 'GET' })
  .middleware([dbMiddleware])
  .inputValidator(z.object({ query: z.string().min(1).max(100) }))
  .handler((ctx) => {
    return searchService.query(ctx.context.db, ctx.data);
  });
