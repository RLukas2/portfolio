import type { db as DB } from '@xbrk/db/client';

export type DbClient = typeof DB;

export interface AdminContext {
  user: { id: string; role: 'admin' };
}
