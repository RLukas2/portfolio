import { createServerFn } from '@tanstack/react-start';
import { projectService } from '@xbrk/api';
import { processMarkdownToHtml } from '@xbrk/md';
import { z } from 'zod/v4';
import { optionalAuthMiddleware } from '@/lib/auth/middleware';
import { dbMiddleware } from '@/lib/middleware/db';

/**
 * Server function to fetch all published projects.
 *
 * @returns Array of public projects
 */
export const $getAllPublicProjects = createServerFn({ method: 'GET' })
  .middleware([dbMiddleware])
  .handler(({ context }) => {
    return projectService.getAllPublic(context.db);
  });

/**
 * Server function to fetch a project by its slug.
 * Processes markdown content to HTML server-side for instant rendering.
 *
 * @param slug - The project slug
 * @returns The project data with pre-rendered HTML content, or null if not found
 */
export const $getProjectBySlug = createServerFn({ method: 'GET' })
  .middleware([dbMiddleware, optionalAuthMiddleware])
  .inputValidator(z.object({ slug: z.string() }))
  .handler(async (ctx) => {
    const session = ctx.context.user ? { user: { role: ctx.context.user.role ?? '' } } : null;
    const project = await projectService.getBySlug(ctx.context.db, ctx.data, session);
    if (!project) {
      return null;
    }
    const renderedContent = await processMarkdownToHtml(project.content ?? '');
    return { ...project, renderedContent };
  });
