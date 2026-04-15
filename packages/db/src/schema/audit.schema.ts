import { index, pgTable } from 'drizzle-orm/pg-core';
import { user } from './auth.schema';

/**
 * Audit log table — immutable record of every admin mutation.
 *
 * Columns:
 *  - action    : verb describing the operation (e.g. "article.create")
 *  - resource  : the type of entity affected (e.g. "article")
 *  - resourceId: the id of the affected record (nullable for bulk ops)
 *  - actorId   : FK to user.id — who performed the action (nullable, set null on user delete)
 *  - metadata  : arbitrary JSON payload (sanitised input snapshot, diff, etc.)
 *  - ipAddress : client IP at time of action (for session abuse detection)
 *  - userAgent : browser/client user-agent string
 *  - createdAt : immutable timestamp — no updatedAt by design
 */
export const auditLogs = pgTable(
  'audit_logs',
  (t) => ({
    id: t.uuid().notNull().primaryKey().defaultRandom(),
    action: t.varchar({ length: 100 }).notNull(),
    resource: t.varchar({ length: 100 }).notNull(),
    resourceId: t.text(),
    actorId: t.text().references(() => user.id, { onDelete: 'set null' }),
    metadata: t.jsonb().$type<Record<string, unknown>>(),
    ipAddress: t.varchar({ length: 45 }), // 45 chars covers IPv6
    userAgent: t.text(),
    createdAt: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
  }),
  (table) => [
    index('audit_logs_actor_id_idx').on(table.actorId),
    index('audit_logs_resource_idx').on(table.resource),
    index('audit_logs_created_at_idx').on(table.createdAt),
    // Composite index for entity audit trails
    index('audit_logs_resource_resource_id_idx').on(table.resource, table.resourceId),
    // Composite index for user activity queries
    index('audit_logs_actor_id_created_at_idx').on(table.actorId, table.createdAt),
  ],
);
