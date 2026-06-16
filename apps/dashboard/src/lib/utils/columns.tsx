import { Link } from '@tanstack/react-router';
import { type ColumnDef } from '@tanstack/react-table';
import { Badge } from '@xbrk/ui/badge';
import { Checkbox } from '@xbrk/ui/checkbox';
import { Star } from 'lucide-react';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';

export interface BaseItemType {
  description: string | null;
  id: string;
  isDraft: boolean;
  title: string;
}

interface CreateCommonColumnsOptions {
  /**
   * The base path for editing items (e.g., '/blog', '/projects')
   * If provided, the title column will be clickable and navigate to the edit page
   */
  editBasePath?: string;
}

export function createCommonColumns<T extends BaseItemType>(
  entityName: string,
  options?: CreateCommonColumnsOptions,
): ColumnDef<T>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <div className="pl-4">
          <Checkbox
            aria-label={`Select all ${entityName}`}
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(Boolean(value))}
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="pl-4">
          <Checkbox
            aria-label={`Select ${row.original.title}`}
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onCheckedChange={(value) => row.toggleSelected(Boolean(value))}
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'title',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
      cell: ({ row }) =>
        options?.editBasePath ? (
          <Link
            className="font-medium text-primary hover:underline"
            // @ts-expect-error - Dynamic route construction
            to={`${options.editBasePath}/${row.original.id}/edit`}
          >
            {row.original.title}
          </Link>
        ) : (
          row.original.title
        ),
      filterFn: 'includesString',
    },
    {
      accessorKey: 'description',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
      cell: ({ row }) => <div className="text-wrap">{row.original.description}</div>,
      filterFn: 'includesString',
    },
    {
      accessorKey: 'isDraft',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const isDraft = row.original.isDraft;
        return (
          <Badge
            className={
              isDraft
                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-500'
                : 'bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-500'
            }
            variant={isDraft ? 'secondary' : 'default'}
          >
            {isDraft ? 'Draft' : 'Published'}
          </Badge>
        );
      },
    },
  ];
}

export function createToggleColumn<T extends { title: string }>(
  accessorKey: keyof T & string,
  title: string,
): ColumnDef<T> {
  return {
    accessorKey,
    header: ({ column }) => <DataTableColumnHeader column={column} title={title} />,
    cell: ({ row }) => {
      const value = row.original[accessorKey] as unknown as boolean;

      if (accessorKey === 'isFeatured') {
        return (
          <div className="flex w-full items-center justify-center">
            <Star
              aria-label={`${row.original.title} is featured: ${value ? 'Yes' : 'No'}`}
              className={`h-4 w-4 ${value ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`}
            />
          </div>
        );
      }

      return <Badge variant={value ? 'default' : 'secondary'}>{value ? 'Yes' : 'No'}</Badge>;
    },
  };
}
