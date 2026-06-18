import { createServerFn } from '@tanstack/react-start';
import { offeringsService } from '@xbrk/api';
import { CreateServiceSchema, UpdateServiceSchema } from '@xbrk/db/api-schemas';
import { z } from 'zod/v4';
import { adminServerMiddleware } from '@/lib/middleware/admin-server';

export const $getAllServices = createServerFn({ method: 'GET' })
  .middleware(adminServerMiddleware)
  .handler(({ context }) => {
    return offeringsService.getAll(context.db);
  });

export const $getServiceById = createServerFn({ method: 'GET' })
  .middleware(adminServerMiddleware)
  .inputValidator(z.object({ id: z.string() }))
  .handler((ctx) => {
    return offeringsService.getById(ctx.context.db, ctx.data);
  });

export const $createService = createServerFn({ method: 'POST' })
  .middleware(adminServerMiddleware)
  .inputValidator(CreateServiceSchema)
  .handler((ctx) => {
    return offeringsService.create(ctx.context.db, ctx.data);
  });

export const $updateService = createServerFn({ method: 'POST' })
  .middleware(adminServerMiddleware)
  .inputValidator(UpdateServiceSchema)
  .handler((ctx) => {
    return offeringsService.update(ctx.context.db, ctx.data);
  });

export const $deleteService = createServerFn({ method: 'POST' })
  .middleware(adminServerMiddleware)
  .inputValidator(z.string())
  .handler((ctx) => {
    return offeringsService.remove(ctx.context.db, ctx.data);
  });
