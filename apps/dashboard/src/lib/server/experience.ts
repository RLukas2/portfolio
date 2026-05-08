import { createServerFn } from '@tanstack/react-start';
import { experienceService } from '@xbrk/api';
import { CreateExperienceSchema, UpdateExperienceSchema } from '@xbrk/db/schema';
import { z } from 'zod/v4';
import { adminMiddleware, authMiddleware } from '@/lib/auth/middleware';
import { auditMiddleware } from '@/lib/middleware/audit';
import { dbMiddleware } from '@/lib/middleware/db';
import { sentryMiddleware } from '@/lib/middleware/sentry';

export const $getAllExperiences = createServerFn({ method: 'GET' })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware, auditMiddleware])
  .handler(({ context }) => experienceService.getAll(context.db));

export const $getExperienceById = createServerFn({ method: 'GET' })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware, auditMiddleware])
  .inputValidator(z.object({ id: z.string() }))
  .handler(({ context, data }) => experienceService.getById(context.db, data));

export const $createExperience = createServerFn({ method: 'POST' })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware, auditMiddleware])
  .inputValidator(CreateExperienceSchema)
  .handler(async ({ context, data }) => {
    const result = await experienceService.create(context.db, data);
    context.audit('experience.create', 'experience', result?.id, { title: result?.title });
    return result;
  });

export const $updateExperience = createServerFn({ method: 'POST' })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware, auditMiddleware])
  .inputValidator(UpdateExperienceSchema)
  .handler(async ({ context, data }) => {
    const result = await experienceService.update(context.db, data);
    context.audit('experience.update', 'experience', result?.id, { title: result?.title });
    return result;
  });

export const $deleteExperience = createServerFn({ method: 'POST' })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware, auditMiddleware])
  .inputValidator(z.string())
  .handler(async ({ context, data }) => {
    const result = await experienceService.remove(context.db, data);
    context.audit('experience.delete', 'experience', data);
    return result;
  });
