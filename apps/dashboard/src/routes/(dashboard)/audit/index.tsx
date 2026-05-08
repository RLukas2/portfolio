import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import type { PaginationState } from '@tanstack/react-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@xbrk/ui/card';
import { useEffect, useState } from 'react';
import { auditLogColumns } from '@/components/audit/columns';
import { AuditToolbar } from '@/components/audit/toolbar';
import { ServerSideDataTable } from '@/components/data-table/server-side-data-table';
import { $exportAuditLogs, $getActionTypes, $getAuditLogs, $getResourceTypes } from '@/lib/server/audit';

export const Route = createFileRoute('/(dashboard)/audit/')({
  component: AuditLogsPage,
  loader: async () => {
    const [initialLogs, resourceTypes, actionTypes] = await Promise.all([
      $getAuditLogs({ data: { page: 1, limit: 50 } }),
      $getResourceTypes(),
      $getActionTypes(),
    ]);

    return {
      initialLogs,
      resourceTypes,
      actionTypes,
    };
  },
});

function AuditLogsPage() {
  const loaderData = Route.useLoaderData();
  const { initialLogs, resourceTypes, actionTypes } = loaderData;

  const [filters, setFilters] = useState<{
    resource?: string;
    action?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
  }>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 50,
  });

  // Reset to first page when filters change
  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  // Server-side pagination - fetch only the current page
  const { data: logsResult } = useSuspenseQuery({
    queryKey: ['audit-logs', filters, pagination.pageIndex, pagination.pageSize],
    queryFn: async () => {
      const result = await $getAuditLogs({
        data: {
          ...filters,
          page: pagination.pageIndex + 1, // API uses 1-based pagination
          limit: pagination.pageSize,
        },
      });
      return result;
    },
    initialData: initialLogs,
  });

  // Sync DataTable's internal pagination with server pagination
  // by providing all data for the current page
  useEffect(() => {
    // When total pages change and current page is out of bounds, reset to last page
    const totalPages = logsResult.pagination.totalPages;
    if (pagination.pageIndex >= totalPages && totalPages > 0) {
      setPagination((prev) => ({ ...prev, pageIndex: totalPages - 1 }));
    }
  }, [logsResult.pagination.totalPages, pagination.pageIndex]);

  const handleExport = async () => {
    try {
      // biome-ignore lint/suspicious/noExplicitAny: Server function return type is not properly inferred
      const result: any = await $exportAuditLogs({
        data: { ...filters, page: 1, limit: 10_000 },
      });

      // Create blob and download
      const blob = new Blob([result.csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to export audit logs:', error);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">Audit Logs</h1>
        <p className="text-muted-foreground">View and search all administrative actions performed in the system</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>Complete audit trail of all create, update, and delete operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <AuditToolbar
              actionTypes={actionTypes}
              filters={filters}
              onExport={handleExport}
              onFiltersChange={handleFiltersChange}
              resourceTypes={resourceTypes}
            />

            <div className="mb-2 text-muted-foreground text-sm">
              Showing {logsResult.data.length > 0 ? pagination.pageIndex * pagination.pageSize + 1 : 0} to{' '}
              {Math.min((pagination.pageIndex + 1) * pagination.pageSize, logsResult.pagination.total)} of{' '}
              {logsResult.pagination.total} audit log entries
            </div>

            <ServerSideDataTable
              columns={auditLogColumns}
              data={logsResult.data}
              entityName="audit logs"
              onPaginationChange={setPagination}
              pagination={pagination}
              totalCount={logsResult.pagination.total}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
