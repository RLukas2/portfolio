import { createServerFn } from '@tanstack/react-start';
import { projectService } from '@xbrk/api';
import { CreateProjectSchema, UpdateProjectSchema } from '@xbrk/db/schema';
import { z } from 'zod/v4';
import { adminMiddleware, authMiddleware } from '@/lib/auth/middleware';
import { auditMiddleware } from '@/lib/middleware/audit';
import { dbMiddleware } from '@/lib/middleware/db';
import { sentryMiddleware } from '@/lib/middleware/sentry';

const MW = [sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware, auditMiddleware];

export const $getAllProjects = createServerFn({ method: 'GET' })
  .middleware(MW)
  .handler(({ context }) => projectService.getAll(context.db));

export const $getProjectById = createServerFn({ method: 'GET' })
  .middleware(MW)
  .inputValidator(z.object({ id: z.string() }))
  .handler((ctx) => projectService.getById(ctx.context.db, ctx.data));

export const $createProject = createServerFn({ method: 'POST' })
  .middleware(MW)
  .inputValidator(CreateProjectSchema)
  .handler(async (ctx) => {
    const result = await projectService.create(ctx.context.db, ctx.data);
    await ctx.context.audit('project.create', 'project', result.id, { title: result.title });
    return result;
  });

export const $updateProject = createServerFn({ method: 'POST' })
  .middleware(MW)
  .inputValidator(UpdateProjectSchema)
  .handler(async (ctx) => {
    const result = await projectService.update(ctx.context.db, ctx.data);
    await ctx.context.audit('project.update', 'project', result.id, { title: result.title });
    return result;
  });

export const $deleteProject = createServerFn({ method: 'POST' })
  .middleware(MW)
  .inputValidator(z.string())
  .handler(async (ctx) => {
    const result = await projectService.remove(ctx.context.db, ctx.data);
    await ctx.context.audit('project.delete', 'project', ctx.data);
    return result;
  });
