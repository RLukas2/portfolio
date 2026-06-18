import { type ColumnDef } from '@tanstack/react-table';
import type { Service } from '@xbrk/db';
import { createCommonColumns } from '@/lib/utils/columns';
import { Actions } from './actions';

export const serviceColumns: ColumnDef<Service>[] = [
  ...createCommonColumns<Service>('services', { editBasePath: '/services' }),
  {
    id: 'actions',
    cell: ({ row }) => <Actions id={row.original.id} slug={row.original.slug} title={row.original.title} />,
    maxSize: 60,
    size: 60,
  },
];
