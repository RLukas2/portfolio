import { createServerFn } from '@tanstack/react-start';
import { userService } from '@xbrk/api';
import { adminMiddleware, authMiddleware } from '@/lib/auth/middleware';
import { dbMiddleware } from '@/lib/middleware/db';
import { sentryMiddleware } from '@/lib/middleware/sentry';

export const $getAllUsers = createServerFn({ method: 'GET' })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware])
  .handler(({ context }) => {
    return userService.getAll(context.db);
  });
