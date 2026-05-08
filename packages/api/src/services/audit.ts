// biome-ignore lint/performance/noNamespaceImport: Sentry SDK requires namespace import
import * as Sentry from '@sentry/node';
import { db as DB } from '@xbrk/db/client';
import { auditLogs, user } from '@xbrk/db/schema';
import { and, asc, between, desc, eq, gte, ilike, lte, or, sql } from 'drizzle-orm';
import type { PaginatedResult, PaginationInput } from '../lib/base-service';

type DbClient = typeof DB;

export interface AuditLogFilters {
  action?: string;
  actorId?: string;
  endDate?: Date;
  requestId?: string;
  resource?: string;
  resourceId?: string;
  search?: string;
  sessionId?: string;
  startDate?: Date;
}

export interface AuditLogWithActor {
  action: string;
  actorEmail: string | null;
  actorId: string | null;
  actorName: string | null;
  createdAt: Date;
  id: string;
  ipAddress: string | null;
  metadata: Record<string, unknown> | null;
  requestId: string | null;
  resource: string;
  resourceId: string | null;
  sessionId: string | null;
  userAgent: string | null;
}

/**
 * Get paginated audit logs with optional filters
 */
export async function getAuditLogs(
  db: DbClient,
  filters: AuditLogFilters = {},
  pagination: PaginationInput = { page: 1, limit: 50 },
): Promise<PaginatedResult<AuditLogWithActor>> {
  try {
    const { page = 1, limit = 50 } = pagination;
    const offset = (page - 1) * limit;

    // Build where conditions
    const conditions: ReturnType<typeof eq>[] = [];

    if (filters.actorId) {
      conditions.push(eq(auditLogs.actorId, filters.actorId));
    }

    if (filters.resource) {
      conditions.push(eq(auditLogs.resource, filters.resource));
    }

    if (filters.action) {
      conditions.push(eq(auditLogs.action, filters.action));
    }

    if (filters.resourceId) {
      conditions.push(eq(auditLogs.resourceId, filters.resourceId));
    }

    if (filters.requestId) {
      conditions.push(eq(auditLogs.requestId, filters.requestId));
    }

    if (filters.sessionId) {
      conditions.push(eq(auditLogs.sessionId, filters.sessionId));
    }

    if (filters.startDate && filters.endDate) {
      conditions.push(between(auditLogs.createdAt, filters.startDate, filters.endDate));
    } else if (filters.startDate) {
      conditions.push(gte(auditLogs.createdAt, filters.startDate));
    } else if (filters.endDate) {
      conditions.push(lte(auditLogs.createdAt, filters.endDate));
    }

    if (filters.search) {
      const searchCondition = or(
        ilike(auditLogs.action, `%${filters.search}%`),
        ilike(auditLogs.resource, `%${filters.search}%`),
        ilike(auditLogs.resourceId, `%${filters.search}%`),
      );
      if (searchCondition) {
        conditions.push(searchCondition);
      }
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get total count
    const [countResult] = await db.select({ count: sql<number>`COUNT(*)::int` }).from(auditLogs).where(whereClause);

    const total = countResult?.count ?? 0;

    // Get paginated results with actor info
    const results = await db
      .select({
        id: auditLogs.id,
        action: auditLogs.action,
        resource: auditLogs.resource,
        resourceId: auditLogs.resourceId,
        actorId: auditLogs.actorId,
        actorName: user.name,
        actorEmail: user.email,
        metadata: auditLogs.metadata,
        ipAddress: auditLogs.ipAddress,
        userAgent: auditLogs.userAgent,
        requestId: auditLogs.requestId,
        sessionId: auditLogs.sessionId,
        createdAt: auditLogs.createdAt,
      })
      .from(auditLogs)
      .leftJoin(user, eq(auditLogs.actorId, user.id))
      .where(whereClause)
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit)
      .offset(offset);

    return {
      data: results,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    Sentry.captureException(error);
    console.error('[audit.getAuditLogs] Database error:', error);
    throw new Error('Failed to fetch audit logs');
  }
}

/**
 * Get audit trail for a specific resource
 */
export async function getResourceAuditTrail(
  db: DbClient,
  resource: string,
  resourceId: string,
): Promise<AuditLogWithActor[]> {
  try {
    const results = await db
      .select({
        id: auditLogs.id,
        action: auditLogs.action,
        resource: auditLogs.resource,
        resourceId: auditLogs.resourceId,
        actorId: auditLogs.actorId,
        actorName: user.name,
        actorEmail: user.email,
        metadata: auditLogs.metadata,
        ipAddress: auditLogs.ipAddress,
        userAgent: auditLogs.userAgent,
        requestId: auditLogs.requestId,
        sessionId: auditLogs.sessionId,
        createdAt: auditLogs.createdAt,
      })
      .from(auditLogs)
      .leftJoin(user, eq(auditLogs.actorId, user.id))
      .where(and(eq(auditLogs.resource, resource), eq(auditLogs.resourceId, resourceId)))
      .orderBy(asc(auditLogs.createdAt));

    return results;
  } catch (error) {
    Sentry.captureException(error);
    console.error('[audit.getResourceAuditTrail] Database error:', error);
    throw new Error('Failed to fetch resource audit trail');
  }
}

/**
 * Get audit logs for a specific user
 */
export function getUserAuditLogs(
  db: DbClient,
  actorId: string,
  pagination: PaginationInput = { page: 1, limit: 50 },
): Promise<PaginatedResult<AuditLogWithActor>> {
  return getAuditLogs(db, { actorId }, pagination);
}

/**
 * Get audit logs for a specific session
 */
export async function getSessionAuditLogs(db: DbClient, sessionId: string): Promise<AuditLogWithActor[]> {
  try {
    const results = await db
      .select({
        id: auditLogs.id,
        action: auditLogs.action,
        resource: auditLogs.resource,
        resourceId: auditLogs.resourceId,
        actorId: auditLogs.actorId,
        actorName: user.name,
        actorEmail: user.email,
        metadata: auditLogs.metadata,
        ipAddress: auditLogs.ipAddress,
        userAgent: auditLogs.userAgent,
        requestId: auditLogs.requestId,
        sessionId: auditLogs.sessionId,
        createdAt: auditLogs.createdAt,
      })
      .from(auditLogs)
      .leftJoin(user, eq(auditLogs.actorId, user.id))
      .where(eq(auditLogs.sessionId, sessionId))
      .orderBy(desc(auditLogs.createdAt));

    return results;
  } catch (error) {
    Sentry.captureException(error);
    console.error('[audit.getSessionAuditLogs] Database error:', error);
    throw new Error('Failed to fetch session audit logs');
  }
}

/**
 * Get audit logs for a specific request (correlated operations)
 */
export async function getRequestAuditLogs(db: DbClient, requestId: string): Promise<AuditLogWithActor[]> {
  try {
    const results = await db
      .select({
        id: auditLogs.id,
        action: auditLogs.action,
        resource: auditLogs.resource,
        resourceId: auditLogs.resourceId,
        actorId: auditLogs.actorId,
        actorName: user.name,
        actorEmail: user.email,
        metadata: auditLogs.metadata,
        ipAddress: auditLogs.ipAddress,
        userAgent: auditLogs.userAgent,
        requestId: auditLogs.requestId,
        sessionId: auditLogs.sessionId,
        createdAt: auditLogs.createdAt,
      })
      .from(auditLogs)
      .leftJoin(user, eq(auditLogs.actorId, user.id))
      .where(eq(auditLogs.requestId, requestId))
      .orderBy(asc(auditLogs.createdAt));

    return results;
  } catch (error) {
    Sentry.captureException(error);
    console.error('[audit.getRequestAuditLogs] Database error:', error);
    throw new Error('Failed to fetch request audit logs');
  }
}

/**
 * Get unique resource types from audit logs
 */
export async function getResourceTypes(db: DbClient): Promise<string[]> {
  try {
    const results = await db
      .selectDistinct({ resource: auditLogs.resource })
      .from(auditLogs)
      .orderBy(asc(auditLogs.resource));

    return results.map((r) => r.resource);
  } catch (error) {
    Sentry.captureException(error);
    console.error('[audit.getResourceTypes] Database error:', error);
    throw new Error('Failed to fetch resource types');
  }
}

/**
 * Get unique action types from audit logs
 */
export async function getActionTypes(db: DbClient): Promise<string[]> {
  try {
    const results = await db
      .selectDistinct({ action: auditLogs.action })
      .from(auditLogs)
      .orderBy(asc(auditLogs.action));

    return results.map((r) => r.action);
  } catch (error) {
    Sentry.captureException(error);
    console.error('[audit.getActionTypes] Database error:', error);
    throw new Error('Failed to fetch action types');
  }
}

export const auditService = {
  getAuditLogs,
  getResourceAuditTrail,
  getUserAuditLogs,
  getSessionAuditLogs,
  getRequestAuditLogs,
  getResourceTypes,
  getActionTypes,
};
