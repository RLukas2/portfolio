// biome-ignore lint/performance/noNamespaceImport: Sentry SDK requires namespace import
import * as Sentry from '@sentry/node';
import type { db as DbClient } from '@xbrk/db/client';
import { auditLogs } from '@xbrk/db/schema';

type Db = typeof DbClient;

export interface AuditEntry {
  action: string;
  actorId: string;
  metadata?: Record<string, unknown>;
  resource: string;
  resourceId?: string;
}

/**
 * Writes a single audit log entry.
 *
 * Designed to be fire-and-forget — it never throws so a logging failure
 * cannot break the operation being audited. Errors are forwarded to Sentry.
 *
 * @example
 * await writeAuditLog(db, {
 *   action: 'article.create',
 *   resource: 'article',
 *   resourceId: article.id,
 *   actorId: user.id,
 *   metadata: { title: article.title },
 * });
 */
export async function writeAuditLog(db: Db, entry: AuditEntry): Promise<void> {
  try {
    await db.insert(auditLogs).values({
      action: entry.action,
      resource: entry.resource,
      resourceId: entry.resourceId,
      actorId: entry.actorId,
      metadata: entry.metadata,
    });
  } catch (error) {
    // Never let audit logging break the main operation
    Sentry.captureException(error, {
      tags: { component: 'audit-log' },
      extra: { entry },
    });
  }
}

/**
 * Returns a bound audit function pre-filled with the actor's id.
 * Pass this into context so handlers don't need to repeat the actorId.
 *
 * @example
 * const audit = createAuditor(db, user.id);
 * await audit('article.create', 'article', article.id, { title: article.title });
 */
export function createAuditor(db: Db, actorId: string) {
  return (action: string, resource: string, resourceId?: string, metadata?: Record<string, unknown>) =>
    writeAuditLog(db, { action, resource, resourceId, actorId, metadata });
}
