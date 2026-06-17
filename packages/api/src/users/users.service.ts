import type { AdminContext, DbClient } from '../shared/db';
import { reportError } from '../shared/errors';

export async function getAll(db: DbClient, _admin: AdminContext) {
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
    reportError('users.getAll', error);
    return [];
  }
}
