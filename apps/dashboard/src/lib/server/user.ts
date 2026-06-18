import { createServerFn } from '@tanstack/react-start';
import { usersService } from '@xbrk/api';
import { adminServerMiddleware } from '@/lib/middleware/admin-server';

const adminCtx = (user: { id: string }) => ({ user: { id: user.id, role: 'admin' as const } });

export const $getAllUsers = createServerFn({ method: 'GET' })
  .middleware(adminServerMiddleware)
  .handler(({ context }) => {
    return usersService.getAll(context.db, adminCtx(context.user));
  });
