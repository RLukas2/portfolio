import { type ColumnDef } from '@tanstack/react-table';
import type { Snippet } from '@xbrk/db';
import { createCommonColumns } from '@/lib/utils/columns';
import { Actions } from './actions';

export const snippetColumns: ColumnDef<Snippet>[] = [
  ...createCommonColumns<Snippet>('snippets', { editBasePath: '/snippets' }),
  {
    id: 'actions',
    cell: ({ row }) => <Actions id={row.original.id} slug={row.original.slug} title={row.original.title} />,
    maxSize: 60,
    size: 60,
  },
];
