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
 *  - metadata  : arbitrary JSON payload with before/after states, input snapshot, diff, etc.
 *  - ipAddress : client IP at time of action (for session abuse detection)
 *  - userAgent : browser/client user-agent string
 *  - requestId : unique identifier for correlating related operations
 *  - sessionId : session identifier for tracking actions within the same session
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
    requestId: t.text(),
    sessionId: t.text(),
    createdAt: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
  }),
  (table) => [
    index('audit_logs_actor_id_idx').on(table.actorId),
    index('audit_logs_resource_idx').on(table.resource),
    index('audit_logs_created_at_idx').on(table.createdAt),
    index('audit_logs_action_idx').on(table.action),
    // Composite index for entity audit trails
    index('audit_logs_resource_resource_id_idx').on(table.resource, table.resourceId),
    // Composite index for user activity queries
    index('audit_logs_actor_id_created_at_idx').on(table.actorId, table.createdAt),
    // Index for request correlation
    index('audit_logs_request_id_idx').on(table.requestId),
    // Index for session tracking
    index('audit_logs_session_id_idx').on(table.sessionId),
  ],
);
