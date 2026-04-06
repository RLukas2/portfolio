import { createServerFn } from '@tanstack/react-start';
import { projectService } from '@xbrk/api';
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
 *
 * @param slug - The project slug
 * @returns The project data or null if not found
 */
export const $getProjectBySlug = createServerFn({ method: 'GET' })
  .middleware([dbMiddleware, optionalAuthMiddleware])
  .inputValidator(z.object({ slug: z.string() }))
  .handler((ctx) => {
    const session = ctx.context.user ? { user: { role: ctx.context.user.role ?? '' } } : null;
    return projectService.getBySlug(ctx.context.db, ctx.data, session);
  });
