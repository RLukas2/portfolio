import { type ColumnDef } from '@tanstack/react-table';
import type { ProjectType } from '@xbrk/types';
import { createCommonColumns, createToggleColumn } from '@/lib/utils/columns';
import { Actions } from './actions';

export const projectColumns: ColumnDef<ProjectType>[] = [
  ...createCommonColumns<ProjectType>('projects', { editBasePath: '/projects' }),
  createToggleColumn<ProjectType>('isFeatured', 'Featured'),
  {
    id: 'actions',
    cell: ({ row }) => <Actions id={row.original.id} slug={row.original.slug} title={row.original.title} />,
  },
];
