import { createServerFn } from '@tanstack/react-start';
import { guestbookService } from '@xbrk/api';
import { z } from 'zod/v4';
import { authMiddleware } from '@/lib/auth/middleware';
import { dbMiddleware } from '@/lib/middleware/db';

/**
 * Server function to fetch all guestbook entries.
 *
 * @returns Array of guestbook entries
 */
export const $getAllGuestbookEntries = createServerFn({ method: 'GET' })
  .middleware([dbMiddleware])
  .handler(({ context }) => {
    return guestbookService.getAll(context.db);
  });

/**
 * Server function to create a new guestbook entry.
 * Requires authentication.
 *
 * @param message - The guestbook message (1-500 characters)
 * @returns The created guestbook entry
 */
export const $createGuestbookEntry = createServerFn({ method: 'POST' })
  .middleware([dbMiddleware, authMiddleware])
  .inputValidator(
    z.object({
      message: z.string().trim().min(1, 'Message cannot be empty').max(500, 'Message is too long'),
    }),
  )
  .handler((ctx) => {
    return guestbookService.create(ctx.context.db, ctx.data, ctx.context.user.id);
  });

/**
 * Server function to delete a guestbook entry.
 * Requires authentication and proper permissions.
 *
 * @param id - The guestbook entry ID
 * @returns Success status
 */
export const $deleteGuestbookEntry = createServerFn({ method: 'POST' })
  .middleware([dbMiddleware, authMiddleware])
  .inputValidator(z.object({ id: z.string() }))
  .handler((ctx) => {
    return guestbookService.remove(ctx.context.db, ctx.data, ctx.context.user.id, ctx.context.user.role ?? '');
  });
