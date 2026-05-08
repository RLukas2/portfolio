import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import { blogService } from '@xbrk/api';
import { processMarkdownToHtml } from '@xbrk/md';
import { z } from 'zod/v4';
import { optionalAuthMiddleware } from '@/lib/auth/middleware';
import { dbMiddleware } from '@/lib/middleware/db';

/**
 * Server function to fetch all published blog articles.
 *
 * @returns Array of public blog articles
 */
export const $getAllPublicArticles = createServerFn({ method: 'GET' })
  .middleware([dbMiddleware])
  .handler(({ context }) => {
    return blogService.getAllPublic(context.db);
  });

/**
 * Server function to fetch a blog article by its slug.
 * Processes markdown content to HTML server-side for instant rendering.
 *
 * @param slug - The article slug
 * @returns The article data with pre-rendered HTML content, or null if not found
 */
export const $getArticleBySlug = createServerFn({ method: 'GET' })
  .middleware([dbMiddleware, optionalAuthMiddleware])
  .inputValidator(z.object({ slug: z.string() }))
  .handler(
    // biome-ignore lint/suspicious/noExplicitAny: Drizzle relation types trigger serialization false positive
    async (ctx): Promise<any> => {
      const session = ctx.context.user ? { user: { role: ctx.context.user.role ?? '' } } : null;
      const article = await blogService.getBySlug(ctx.context.db, ctx.data, session);
      if (!article) {
        return null;
      }
      const renderedContent = await processMarkdownToHtml(article.content ?? '');
      return { ...article, renderedContent };
    },
  );

/**
 * Server function to like/unlike a blog article.
 *
 * @param slug - The article slug
 * @returns Updated like status
 */
export const $likeArticle = createServerFn({ method: 'POST' })
  .middleware([dbMiddleware])
  .inputValidator(z.object({ slug: z.string() }))
  .handler((ctx) => {
    return blogService.like(ctx.context.db, ctx.data, getRequest().headers);
  });

/**
 * Server function to check if an article is liked by the current user.
 *
 * @param slug - The article slug
 * @returns Boolean indicating like status
 */
export const $isArticleLiked = createServerFn({ method: 'GET' })
  .middleware([dbMiddleware])
  .inputValidator(z.object({ slug: z.string() }))
  .handler((ctx) => {
    return blogService.isLiked(ctx.context.db, ctx.data, getRequest().headers);
  });

/**
 * Server function to record a view for a blog article.
 *
 * @param slug - The article slug
 * @returns Updated view count
 */
export const $viewArticle = createServerFn({ method: 'POST' })
  .middleware([dbMiddleware])
  .inputValidator(z.object({ slug: z.string() }))
  .handler((ctx) => {
    return blogService.view(ctx.context.db, ctx.data);
  });
