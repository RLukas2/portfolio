import { createServerFn } from '@tanstack/react-start';
import { projectService } from '@xbrk/api';
import { CreateProjectSchema, UpdateProjectSchema } from '@xbrk/db/schema';
import { z } from 'zod/v4';
import { adminMiddleware, authMiddleware } from '@/lib/auth/middleware';
import { auditMiddleware } from '@/lib/middleware/audit';
import { dbMiddleware } from '@/lib/middleware/db';
import { sentryMiddleware } from '@/lib/middleware/sentry';

export const $getAllProjects = createServerFn({ method: 'GET' })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware, auditMiddleware])
  .handler(({ context }) => projectService.getAll(context.db));

export const $getProjectById = createServerFn({ method: 'GET' })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware, auditMiddleware])
  .inputValidator(z.object({ id: z.string() }))
  .handler(({ context, data }) => projectService.getById(context.db, data));

export const $createProject = createServerFn({ method: 'POST' })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware, auditMiddleware])
  .inputValidator(CreateProjectSchema)
  .handler(async ({ context, data }) => {
    const result = await projectService.create(context.db, data);
    context.audit('project.create', 'project', result?.id, { title: result?.title });
    return result;
  });

export const $updateProject = createServerFn({ method: 'POST' })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware, auditMiddleware])
  .inputValidator(UpdateProjectSchema)
  .handler(async ({ context, data }) => {
    const result = await projectService.update(context.db, data);
    context.audit('project.update', 'project', result?.id, { title: result?.title });
    return result;
  });

export const $deleteProject = createServerFn({ method: 'POST' })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware, auditMiddleware])
  .inputValidator(z.string())
  .handler(async ({ context, data }) => {
    const result = await projectService.remove(context.db, data);
    context.audit('project.delete', 'project', data);
    return result;
  });
