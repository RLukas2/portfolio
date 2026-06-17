import { createServerFn } from '@tanstack/react-start';
import { offeringService } from '@xbrk/api';
import { CreateServiceSchema, UpdateServiceSchema } from '@xbrk/db/api-schemas';
import { z } from 'zod/v4';
import { adminMiddleware, authMiddleware } from '@/lib/auth/middleware';
import { dbMiddleware } from '@/lib/middleware/db';
import { sentryMiddleware } from '@/lib/middleware/sentry';

export const $getAllServices = createServerFn({ method: 'GET' })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware])
  .handler(({ context }) => {
    return offeringService.getAll(context.db);
  });

export const $getServiceById = createServerFn({ method: 'GET' })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware])
  .inputValidator(z.object({ id: z.string() }))
  .handler((ctx) => {
    return offeringService.getById(ctx.context.db, ctx.data);
  });

export const $createService = createServerFn({ method: 'POST' })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware])
  .inputValidator(CreateServiceSchema)
  .handler((ctx) => {
    return offeringService.create(ctx.context.db, ctx.data);
  });

export const $updateService = createServerFn({ method: 'POST' })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware])
  .inputValidator(UpdateServiceSchema)
  .handler((ctx) => {
    return offeringService.update(ctx.context.db, ctx.data);
  });

export const $deleteService = createServerFn({ method: 'POST' })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware])
  .inputValidator(z.string())
  .handler((ctx) => {
    return offeringService.remove(ctx.context.db, ctx.data);
  });
