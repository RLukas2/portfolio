import { pgTable } from 'drizzle-orm/pg-core';
import { user } from './auth.schema';

/**
 * Audit log table — immutable record of every admin mutation.
 *
 * Columns:
 *  - action   : verb describing the operation (e.g. "article.create")
 *  - resource : the type of entity affected (e.g. "article")
 *  - resourceId: the id of the affected record (nullable for bulk ops)
 *  - actorId  : FK to user.id — who performed the action
 *  - metadata : arbitrary JSON payload (sanitised input snapshot, diff, etc.)
 *  - createdAt: immutable timestamp — no updatedAt by design
 */
export const auditLogs = pgTable('audit_logs', (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  action: t.varchar({ length: 100 }).notNull(),
  resource: t.varchar({ length: 100 }).notNull(),
  resourceId: t.text(),
  actorId: t
    .text()
    .references(() => user.id, { onDelete: 'set null' })
    .notNull(),
  metadata: t.jsonb().$type<Record<string, unknown>>(),
  createdAt: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
}));
