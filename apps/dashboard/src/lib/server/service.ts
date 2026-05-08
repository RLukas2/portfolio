import { createServerFn } from '@tanstack/react-start';
import { serviceService } from '@xbrk/api';
import { CreateServiceSchema, UpdateServiceSchema } from '@xbrk/db/schema';
import { z } from 'zod/v4';
import { adminMiddleware, authMiddleware } from '@/lib/auth/middleware';
import { auditMiddleware } from '@/lib/middleware/audit';
import { dbMiddleware } from '@/lib/middleware/db';
import { sentryMiddleware } from '@/lib/middleware/sentry';

export const $getAllServices = createServerFn({ method: 'GET' })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware, auditMiddleware])
  .handler(({ context }) => serviceService.getAll(context.db));

export const $getServiceById = createServerFn({ method: 'GET' })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware, auditMiddleware])
  .inputValidator(z.object({ id: z.string() }))
  .handler(({ context, data }) => serviceService.getById(context.db, data));

export const $createService = createServerFn({ method: 'POST' })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware, auditMiddleware])
  .inputValidator(CreateServiceSchema)
  .handler(async ({ context, data }) => {
    const result = await serviceService.create(context.db, data);
    context.audit('service.create', 'service', result?.id, { title: result?.title });
    return result;
  });

export const $updateService = createServerFn({ method: 'POST' })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware, auditMiddleware])
  .inputValidator(UpdateServiceSchema)
  .handler(async ({ context, data }) => {
    const result = await serviceService.update(context.db, data);
    context.audit('service.update', 'service', result?.id, { title: result?.title });
    return result;
  });

export const $deleteService = createServerFn({ method: 'POST' })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware, auditMiddleware])
  .inputValidator(z.string())
  .handler(async ({ context, data }) => {
    const result = await serviceService.remove(context.db, data);
    context.audit('service.delete', 'service', data);
    return result;
  });
