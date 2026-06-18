import { type ColumnDef } from '@tanstack/react-table';
import type { Article } from '@xbrk/db';
import { createCommonColumns } from '@/lib/utils/columns';
import { Actions } from './actions';

export const blogColumns: ColumnDef<Article>[] = [
  ...createCommonColumns<Article>('articles', { editBasePath: '/blog' }),
  {
    id: 'actions',
    cell: ({ row }) => <Actions id={row.original.id} slug={row.original.slug} title={row.original.title} />,
    maxSize: 60,
    size: 60,
  },
];
