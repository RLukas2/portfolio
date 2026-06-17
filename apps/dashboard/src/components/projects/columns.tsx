import { type ColumnDef } from '@tanstack/react-table';
import type { Project } from '@xbrk/db';
import { createCommonColumns, createToggleColumn } from '@/lib/utils/columns';
import { Actions } from './actions';

export const projectColumns: ColumnDef<Project>[] = [
  ...createCommonColumns<Project>('projects', { editBasePath: '/projects' }),
  createToggleColumn<Project>('isFeatured', 'Featured'),
  {
    id: 'actions',
    cell: ({ row }) => <Actions id={row.original.id} slug={row.original.slug} title={row.original.title} />,
  },
];
