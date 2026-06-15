// biome-ignore lint/performance/noNamespaceImport: Sentry SDK requires namespace import
import * as Sentry from '@sentry/node';
import type { db as DB } from '@xbrk/db/client';

type DbClient = typeof DB;

/**
 * Returns all users.
 */
export async function getAll(db: DbClient) {
  try {
    return await db.query.user.findMany({
      columns: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
      },
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error('[user.getAll] Database error:', error);
    return [];
  }
}
