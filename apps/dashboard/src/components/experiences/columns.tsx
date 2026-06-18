import { type ColumnDef } from '@tanstack/react-table';
import type { Experience } from '@xbrk/db';
import { createCommonColumns, createToggleColumn } from '@/lib/utils/columns';
import { DataTableColumnHeader } from '../data-table/data-table-column-header';
import { Actions } from './actions';

export const experienceColumns: ColumnDef<Experience>[] = [
  ...createCommonColumns<Experience>('experiences', { editBasePath: '/experiences' }),
  {
    accessorKey: 'institution',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Institution" />,
    filterFn: 'includesString',
  },
  createToggleColumn<Experience>('isOnGoing', 'On Going'),
  {
    id: 'actions',
    cell: ({ row }) => <Actions id={row.original.id} title={row.original.title} />,
    maxSize: 60,
    size: 60,
  },
];
