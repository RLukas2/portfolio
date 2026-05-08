import { createServerFn } from '@tanstack/react-start';
import { auditService } from '@xbrk/api';
import { z } from 'zod/v4';
import { adminMiddleware, authMiddleware } from '@/lib/auth/middleware';
import { auditMiddleware } from '@/lib/middleware/audit';
import { dbMiddleware } from '@/lib/middleware/db';
import { sentryMiddleware } from '@/lib/middleware/sentry';

const AuditLogFiltersSchema = z.object({
  actorId: z.string().optional(),
  resource: z.string().optional(),
  action: z.string().optional(),
  resourceId: z.string().optional(),
  requestId: z.string().optional(),
  sessionId: z.string().optional(),
  startDate: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  endDate: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  search: z.string().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(1000).default(50), // Higher limit for admin audit logs
});

export const $getAuditLogs = createServerFn({ method: 'GET' })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware, auditMiddleware])
  .inputValidator(AuditLogFiltersSchema)
  .handler(async ({ context, data }) => {
    const { page, limit, ...filters } = data;
    const result = await auditService.getAuditLogs(context.db, filters, {
      page,
      limit,
    });
    // biome-ignore lint/suspicious/noExplicitAny: Type mismatch between Record<string, unknown> and { [x: string]: {} }
    return result as any;
  });

export const $getResourceAuditTrail = createServerFn({ method: 'GET' })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware, auditMiddleware])
  .inputValidator(z.object({ resource: z.string(), resourceId: z.string() }))
  .handler(async ({ context, data }) => {
    const result = await auditService.getResourceAuditTrail(context.db, data.resource, data.resourceId);
    // biome-ignore lint/suspicious/noExplicitAny: Type mismatch between Record<string, unknown> and { [x: string]: {} }
    return result as any;
  });

export const $getUserAuditLogs = createServerFn({ method: 'GET' })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware, auditMiddleware])
  .inputValidator(
    z.object({
      actorId: z.string(),
      page: z.number().int().positive().default(1),
      limit: z.number().int().positive().max(100).default(50),
    }),
  )
  .handler(async ({ context, data }) => {
    const result = await auditService.getUserAuditLogs(context.db, data.actorId, {
      page: data.page,
      limit: data.limit,
    });
    // biome-ignore lint/suspicious/noExplicitAny: Type mismatch between Record<string, unknown> and { [x: string]: {} }
    return result as any;
  });

export const $getSessionAuditLogs = createServerFn({ method: 'GET' })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware, auditMiddleware])
  .inputValidator(z.object({ sessionId: z.string() }))
  .handler(async ({ context, data }) => {
    const result = await auditService.getSessionAuditLogs(context.db, data.sessionId);
    // biome-ignore lint/suspicious/noExplicitAny: Type mismatch between Record<string, unknown> and { [x: string]: {} }
    return result as any;
  });

export const $getRequestAuditLogs = createServerFn({ method: 'GET' })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware, auditMiddleware])
  .inputValidator(z.object({ requestId: z.string() }))
  .handler(async ({ context, data }) => {
    const result = await auditService.getRequestAuditLogs(context.db, data.requestId);
    // biome-ignore lint/suspicious/noExplicitAny: Type mismatch between Record<string, unknown> and { [x: string]: {} }
    return result as any;
  });

export const $getResourceTypes = createServerFn({ method: 'GET' })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware, auditMiddleware])
  .handler(({ context }) => auditService.getResourceTypes(context.db));

export const $getActionTypes = createServerFn({ method: 'GET' })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware, auditMiddleware])
  .handler(({ context }) => auditService.getActionTypes(context.db));

export const $exportAuditLogs = createServerFn({ method: 'GET' })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware, adminMiddleware, auditMiddleware])
  .inputValidator(AuditLogFiltersSchema)
  .handler(async ({ context, data }) => {
    const { page, limit, ...filters } = data;
    // Get all logs without pagination for export
    const result = await auditService.getAuditLogs(context.db, filters, {
      page: 1,
      limit: 10_000,
    });

    // Convert to CSV format
    const headers = [
      'ID',
      'Timestamp',
      'Action',
      'Resource',
      'Resource ID',
      'Actor Name',
      'Actor Email',
      'IP Address',
      'User Agent',
      'Request ID',
      'Session ID',
      'Metadata',
    ];

    const rows = result.data.map((log) => [
      log.id,
      log.createdAt.toISOString(),
      log.action,
      log.resource,
      log.resourceId ?? '',
      log.actorName ?? '',
      log.actorEmail ?? '',
      log.ipAddress ?? '',
      log.userAgent ?? '',
      log.requestId ?? '',
      log.sessionId ?? '',
      JSON.stringify(log.metadata ?? {}),
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    return {
      csv,
      filename: `audit-logs-${new Date().toISOString().split('T')[0]}.csv`,
    };
  });
