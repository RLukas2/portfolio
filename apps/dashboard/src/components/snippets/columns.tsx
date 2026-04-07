import { type ColumnDef } from '@tanstack/react-table';
import type { SnippetType } from '@xbrk/types';
import { createCommonColumns } from '@/lib/utils/columns';
import { Actions } from './actions';

export const snippetColumns: ColumnDef<SnippetType>[] = [
  ...createCommonColumns<SnippetType>('snippets', { editBasePath: '/snippets' }),
  {
    id: 'actions',
    cell: ({ row }) => <Actions id={row.original.id} slug={row.original.slug} title={row.original.title} />,
  },
];
