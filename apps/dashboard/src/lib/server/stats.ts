import { createServerFn } from '@tanstack/react-start';
import { statsService } from '@xbrk/api';
import { z } from 'zod/v4';
import { adminMiddleware, authMiddleware } from '@/lib/auth/middleware';
import { dbMiddleware } from '@/lib/middleware/db';
import { sentryMiddleware } from '@/lib/middleware/sentry';

const statsInput = z.object({ months: z.number().min(1).max(24).default(6) }).optional();

export const $getMonthlyUsers = createServerFn({ method: 'GET' })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware])
  .inputValidator(statsInput)
  .handler((ctx) => {
    return statsService.monthlyUsers(ctx.context.db, ctx.data);
  });

export const $getMonthlyBlogViews = createServerFn({ method: 'GET' })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware])
  .inputValidator(statsInput)
  .handler((ctx) => {
    return statsService.monthlyBlogViews(ctx.context.db, ctx.data);
  });

export const $getTotalStats = createServerFn({ method: 'GET' })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware])
  .handler((ctx) => {
    return statsService.totalStats(ctx.context.db);
  });

const recentActivityInput = z.object({ limit: z.number().min(1).max(50).default(10) }).optional();

export const $getRecentActivity = createServerFn({ method: 'GET' })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware])
  .inputValidator(recentActivityInput)
  .handler((ctx) => {
    return statsService.recentActivity(ctx.context.db, ctx.data?.limit);
  });
