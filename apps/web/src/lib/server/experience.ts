import { createServerFn } from '@tanstack/react-start';
import { experienceService } from '@xbrk/api';
import { dbMiddleware } from '@/lib/middleware/db';

export const $getAllPublicExperiences = createServerFn({ method: 'GET' })
  .middleware([dbMiddleware])
  .handler(({ context }) => {
    return experienceService.getAllPublic(context.db);
  });
