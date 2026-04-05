import { type ColumnDef } from '@tanstack/react-table';
import type { ServiceType } from '@xbrk/types';
import { createCommonColumns } from '@/lib/utils/columns';
import { Actions } from './actions';

export const serviceColumns: ColumnDef<ServiceType>[] = [
  ...createCommonColumns<ServiceType>('services'),
  {
    id: 'actions',
    cell: ({ row }) => <Actions id={row.original.id} slug={row.original.slug} title={row.original.title} />,
  },
];
