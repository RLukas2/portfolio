import { randomUUID } from 'node:crypto';
import { captureException } from '@sentry/node';
import type { db as DbClient } from '@xbrk/db/client';
import { auditLogs } from '@xbrk/db/schema';

type Db = typeof DbClient;

export interface AuditEntry {
  action: string;
  actorId: string;
  ipAddress?: string;
  metadata?: Record<string, unknown>;
  requestId?: string;
  resource: string;
  resourceId?: string;
  sessionId?: string;
  userAgent?: string;
}

export interface AuditMetadata {
  after?: Record<string, unknown>;
  before?: Record<string, unknown>;
  changes?: Record<string, { from: unknown; to: unknown }>;
  [key: string]: unknown;
}

/**
 * Writes a single audit log entry.
 *
 * Designed to be fire-and-forget — it never throws so a logging failure
 * cannot break the operation being audited. Errors are forwarded to Sentry.
 *
 * @example
 * writeAuditLog(db, {
 *   action: 'article.create',
 *   resource: 'article',
 *   resourceId: article.id,
 *   actorId: user.id,
 *   metadata: { after: article },
 *   ipAddress: '1.2.3.4',
 *   userAgent: 'Mozilla/5.0 ...',
 *   requestId: 'req-123',
 *   sessionId: 'sess-456',
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
      ipAddress: entry.ipAddress,
      userAgent: entry.userAgent,
      requestId: entry.requestId,
      sessionId: entry.sessionId,
    });
  } catch (error) {
    // Never let audit logging break the main operation
    captureException(error, {
      tags: { component: 'audit-log' },
      extra: { entry },
    });
  }
}

/**
 * Returns a bound audit function pre-filled with the actor's id, IP, user-agent, request ID, and session ID.
 * Pass this into context so handlers don't need to repeat these fields on every call.
 *
 * @example
 * const audit = createAuditor(db, user.id, '1.2.3.4', 'Mozilla/5.0 ...', 'req-123', 'sess-456');
 * audit('article.create', 'article', article.id, { after: article });
 */
export function createAuditor(
  db: Db,
  actorId: string,
  ipAddress?: string,
  userAgent?: string,
  requestId?: string,
  sessionId?: string,
) {
  return (action: string, resource: string, resourceId?: string, metadata?: Record<string, unknown>) =>
    writeAuditLog(db, {
      action,
      resource,
      resourceId,
      actorId,
      metadata,
      ipAddress,
      userAgent,
      requestId: requestId ?? randomUUID(),
      sessionId,
    });
}

/**
 * Helper to create metadata with before/after states for update operations
 */
export function createUpdateMetadata(before: Record<string, unknown>, after: Record<string, unknown>): AuditMetadata {
  const changes: Record<string, { from: unknown; to: unknown }> = {};

  // Detect changes
  for (const key of Object.keys(after)) {
    if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) {
      changes[key] = { from: before[key], to: after[key] };
    }
  }

  return {
    before,
    after,
    changes,
  };
}
