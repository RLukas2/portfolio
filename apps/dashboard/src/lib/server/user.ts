import { createServerFn } from '@tanstack/react-start';
import { usersService } from '@xbrk/api';
import { adminMiddleware, authMiddleware } from '@/lib/auth/middleware';
import { dbMiddleware } from '@/lib/middleware/db';
import { sentryMiddleware } from '@/lib/middleware/sentry';

const adminCtx = (user: { id: string }) => ({ user: { id: user.id, role: 'admin' as const } });

export const $getAllUsers = createServerFn({ method: 'GET' })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware])
  .handler(({ context }) => {
    return usersService.getAll(context.db, adminCtx(context.user));
  });
