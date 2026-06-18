import { createServerFn } from '@tanstack/react-start';
import { experiencesService } from '@xbrk/api';
import { CreateExperienceSchema, UpdateExperienceSchema } from '@xbrk/db/api-schemas';
import { z } from 'zod/v4';
import { adminServerMiddleware } from '@/lib/middleware/admin-server';

export const $getAllExperiences = createServerFn({ method: 'GET' })
  .middleware(adminServerMiddleware)
  .handler(({ context }) => {
    return experiencesService.getAll(context.db);
  });

export const $getExperienceById = createServerFn({ method: 'GET' })
  .middleware(adminServerMiddleware)
  .inputValidator(z.object({ id: z.string() }))
  .handler((ctx) => {
    return experiencesService.getById(ctx.context.db, ctx.data);
  });

export const $createExperience = createServerFn({ method: 'POST' })
  .middleware(adminServerMiddleware)
  .inputValidator(CreateExperienceSchema)
  .handler((ctx) => {
    return experiencesService.create(ctx.context.db, ctx.data);
  });

export const $updateExperience = createServerFn({ method: 'POST' })
  .middleware(adminServerMiddleware)
  .inputValidator(UpdateExperienceSchema)
  .handler((ctx) => {
    return experiencesService.update(ctx.context.db, ctx.data);
  });

export const $deleteExperience = createServerFn({ method: 'POST' })
  .middleware(adminServerMiddleware)
  .inputValidator(z.string())
  .handler((ctx) => {
    return experiencesService.remove(ctx.context.db, ctx.data);
  });
