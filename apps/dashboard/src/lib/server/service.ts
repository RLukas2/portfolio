import { createServerFn } from '@tanstack/react-start';
import { serviceService } from '@xbrk/api';
import { CreateServiceSchema, UpdateServiceSchema } from '@xbrk/db/schema';
import { z } from 'zod/v4';
import { adminMiddleware, authMiddleware } from '@/lib/auth/middleware';
import { auditMiddleware } from '@/lib/middleware/audit';
import { dbMiddleware } from '@/lib/middleware/db';
import { sentryMiddleware } from '@/lib/middleware/sentry';

const MW = [sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware, auditMiddleware];

export const $getAllServices = createServerFn({ method: 'GET' })
  .middleware(MW)
  .handler(({ context }) => serviceService.getAll(context.db));

export const $getServiceById = createServerFn({ method: 'GET' })
  .middleware(MW)
  .inputValidator(z.object({ id: z.string() }))
  .handler((ctx) => serviceService.getById(ctx.context.db, ctx.data));

export const $createService = createServerFn({ method: 'POST' })
  .middleware(MW)
  .inputValidator(CreateServiceSchema)
  .handler(async (ctx) => {
    const result = await serviceService.create(ctx.context.db, ctx.data);
    await ctx.context.audit('service.create', 'service', result.id, { title: result.title });
    return result;
  });

export const $updateService = createServerFn({ method: 'POST' })
  .middleware(MW)
  .inputValidator(UpdateServiceSchema)
  .handler(async (ctx) => {
    const result = await serviceService.update(ctx.context.db, ctx.data);
    await ctx.context.audit('service.update', 'service', result.id, { title: result.title });
    return result;
  });

export const $deleteService = createServerFn({ method: 'POST' })
  .middleware(MW)
  .inputValidator(z.string())
  .handler(async (ctx) => {
    const result = await serviceService.remove(ctx.context.db, ctx.data);
    await ctx.context.audit('service.delete', 'service', ctx.data);
    return result;
  });
