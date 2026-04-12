import { createServerFn } from '@tanstack/react-start';
import { experienceService } from '@xbrk/api';
import { CreateExperienceSchema, UpdateExperienceSchema } from '@xbrk/db/schema';
import { z } from 'zod/v4';
import { adminMiddleware, authMiddleware } from '@/lib/auth/middleware';
import { auditMiddleware } from '@/lib/middleware/audit';
import { dbMiddleware } from '@/lib/middleware/db';
import { sentryMiddleware } from '@/lib/middleware/sentry';

const MW = [sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware, auditMiddleware];

export const $getAllExperiences = createServerFn({ method: 'GET' })
  .middleware(MW)
  .handler(({ context }) => experienceService.getAll(context.db));

export const $getExperienceById = createServerFn({ method: 'GET' })
  .middleware(MW)
  .inputValidator(z.object({ id: z.string() }))
  .handler((ctx) => experienceService.getById(ctx.context.db, ctx.data));

export const $createExperience = createServerFn({ method: 'POST' })
  .middleware(MW)
  .inputValidator(CreateExperienceSchema)
  .handler(async (ctx) => {
    const result = await experienceService.create(ctx.context.db, ctx.data);
    await ctx.context.audit('experience.create', 'experience', result.id, { title: result.title });
    return result;
  });

export const $updateExperience = createServerFn({ method: 'POST' })
  .middleware(MW)
  .inputValidator(UpdateExperienceSchema)
  .handler(async (ctx) => {
    const result = await experienceService.update(ctx.context.db, ctx.data);
    await ctx.context.audit('experience.update', 'experience', result.id, { title: result.title });
    return result;
  });

export const $deleteExperience = createServerFn({ method: 'POST' })
  .middleware(MW)
  .inputValidator(z.string())
  .handler(async (ctx) => {
    const result = await experienceService.remove(ctx.context.db, ctx.data);
    await ctx.context.audit('experience.delete', 'experience', ctx.data);
    return result;
  });
