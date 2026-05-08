import type { ColumnDef } from '@tanstack/react-table';
import type { AuditLogWithActor } from '@xbrk/api';
import { Badge } from '@xbrk/ui/badge';
import { Button } from '@xbrk/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@xbrk/ui/dialog';
import { format } from 'date-fns';
import { EyeIcon } from 'lucide-react';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';

function MetadataDialog({ metadata }: { metadata: Record<string, unknown> | null }) {
  if (!metadata) {
    return <span className="text-muted-foreground">No metadata</span>;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost">
          <EyeIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Audit Log Metadata</DialogTitle>
          <DialogDescription>Detailed information about this audit log entry</DialogDescription>
        </DialogHeader>
        <pre className="overflow-x-auto rounded-md bg-muted p-4 text-xs">{JSON.stringify(metadata, null, 2)}</pre>
      </DialogContent>
    </Dialog>
  );
}

function getActionColor(action: string): 'default' | 'destructive' | 'secondary' {
  if (action.includes('delete')) {
    return 'destructive';
  }
  if (action.includes('create')) {
    return 'default';
  }
  return 'secondary';
}

export const auditLogColumns: ColumnDef<AuditLogWithActor>[] = [
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Timestamp" />,
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as Date;
      return (
        <div className="flex flex-col">
          <span className="text-sm">{format(date, 'MMM dd, yyyy')}</span>
          <span className="text-muted-foreground text-xs">{format(date, 'HH:mm:ss')}</span>
        </div>
      );
    },
    size: 150,
  },
  {
    accessorKey: 'action',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Action" />,
    cell: ({ row }) => {
      const action = row.getValue('action') as string;
      return <Badge variant={getActionColor(action)}>{action}</Badge>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'resource',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Resource" />,
    cell: ({ row }) => {
      const resource = row.getValue('resource') as string;
      return <Badge variant="outline">{resource}</Badge>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'resourceId',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Resource ID" />,
    cell: ({ row }) => {
      const resourceId = row.getValue('resourceId') as string | null;
      return resourceId ? (
        <code className="rounded bg-muted px-1 py-0.5 text-xs">{resourceId.slice(0, 8)}...</code>
      ) : (
        <span className="text-muted-foreground">-</span>
      );
    },
  },
  {
    accessorKey: 'actorName',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Actor" />,
    cell: ({ row }) => {
      const actorName = row.getValue('actorName') as string | null;
      const actorEmail = row.original.actorEmail;
      return actorName ? (
        <div className="flex flex-col">
          <span className="font-medium text-sm">{actorName}</span>
          <span className="text-muted-foreground text-xs">{actorEmail}</span>
        </div>
      ) : (
        <span className="text-muted-foreground">System</span>
      );
    },
  },
  {
    accessorKey: 'ipAddress',
    header: ({ column }) => <DataTableColumnHeader column={column} title="IP Address" />,
    cell: ({ row }) => {
      const ipAddress = row.getValue('ipAddress') as string | null;
      return ipAddress ? (
        <code className="text-xs">{ipAddress}</code>
      ) : (
        <span className="text-muted-foreground">-</span>
      );
    },
  },
  {
    accessorKey: 'requestId',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Request ID" />,
    cell: ({ row }) => {
      const requestId = row.getValue('requestId') as string | null;
      return requestId ? (
        <code className="rounded bg-muted px-1 py-0.5 text-xs">{requestId.slice(0, 8)}...</code>
      ) : (
        <span className="text-muted-foreground">-</span>
      );
    },
  },
  {
    id: 'metadata',
    header: 'Details',
    cell: ({ row }) => <MetadataDialog metadata={row.original.metadata} />,
    size: 80,
  },
];
