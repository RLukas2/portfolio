import { type ColumnDef } from '@tanstack/react-table';
import type { ArticleType } from '@xbrk/types';
import { createCommonColumns } from '@/lib/utils/columns';
import { Actions } from './actions';

export const blogColumns: ColumnDef<ArticleType>[] = [
  ...createCommonColumns<ArticleType>('articles', { editBasePath: '/blog' }),
  {
    id: 'actions',
    cell: ({ row }) => <Actions id={row.original.id} slug={row.original.slug} title={row.original.title} />,
  },
];
