import { guestbook } from '@xbrk/db/schema';
import { ForbiddenError, InternalServerError, NotFoundError } from '@xbrk/errors';
import { desc, eq } from 'drizzle-orm';
import type { DbClient } from '../shared/db';
import { reportError } from '../shared/errors';

export async function create(db: DbClient, input: { message: string }, userId: string): Promise<void> {
  try {
    await db.insert(guestbook).values({
      userId,
      message: input.message,
    });
  } catch (error) {
    reportError('guestbook.create', error);
    throw new InternalServerError('Failed to create guestbook entry');
  }
}

export async function getAll(db: DbClient) {
  try {
    return await db.query.guestbook.findMany({
      orderBy: desc(guestbook.id),
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
  } catch (error) {
    reportError('guestbook.getAll', error);
    return [];
  }
}

export async function remove(db: DbClient, input: { id: string }, userId: string, userRole: string): Promise<void> {
  try {
    const entry = await db.query.guestbook.findFirst({
      where: eq(guestbook.id, input.id),
    });

    if (!entry) {
      throw new NotFoundError('Guestbook entry not found');
    }

    if (entry.userId !== userId && userRole !== 'admin') {
      throw new ForbiddenError('You are not allowed to delete this guestbook entry');
    }

    await db.delete(guestbook).where(eq(guestbook.id, input.id));
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ForbiddenError) {
      throw error;
    }
    reportError('guestbook.remove', error);
    throw new InternalServerError('Failed to delete guestbook entry');
  }
}
