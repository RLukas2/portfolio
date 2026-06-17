import { createServerFn } from '@tanstack/react-start';
import { projectsService } from '@xbrk/api';
import { CreateProjectSchema, UpdateProjectSchema } from '@xbrk/db/api-schemas';
import { z } from 'zod/v4';
import { adminMiddleware, authMiddleware } from '@/lib/auth/middleware';
import { dbMiddleware } from '@/lib/middleware/db';
import { sentryMiddleware } from '@/lib/middleware/sentry';

export const $getAllProjects = createServerFn({ method: 'GET' })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware])
  .handler(({ context }) => {
    return projectsService.getAll(context.db);
  });

export const $getProjectById = createServerFn({ method: 'GET' })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware])
  .inputValidator(z.object({ id: z.string() }))
  .handler((ctx) => {
    return projectsService.getById(ctx.context.db, ctx.data);
  });

export const $createProject = createServerFn({ method: 'POST' })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware])
  .inputValidator(CreateProjectSchema)
  .handler((ctx) => {
    return projectsService.create(ctx.context.db, ctx.data);
  });

export const $updateProject = createServerFn({ method: 'POST' })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware])
  .inputValidator(UpdateProjectSchema)
  .handler((ctx) => {
    return projectsService.update(ctx.context.db, ctx.data);
  });

export const $deleteProject = createServerFn({ method: 'POST' })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware])
  .inputValidator(z.string())
  .handler((ctx) => {
    return projectsService.remove(ctx.context.db, ctx.data);
  });
