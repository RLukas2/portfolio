import type { Table } from '@tanstack/react-table';
import { Button } from '@xbrk/ui/button';
import { Input } from '@xbrk/ui/input';
import { X } from 'lucide-react';
import type { BulkAction } from './data-table';

interface DataTableToolbarProps<TData> {
  bulkActions?: BulkAction<TData>[];
  entityName?: string;
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  globalFilter,
  setGlobalFilter,
  entityName = 'items',
  table,
  bulkActions,
}: Readonly<DataTableToolbarProps<TData>>) {
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const isSelected = selectedRows.length > 0;

  return (
    <div className="flex items-center justify-between">
      {isSelected && bulkActions ? (
        <div className="fade-in slide-in-from-left-2 flex flex-1 animate-in items-center space-x-4 duration-200">
          <span className="whitespace-nowrap font-medium text-muted-foreground text-sm">
            {selectedRows.length} {selectedRows.length === 1 ? 'item' : 'items'} selected
          </span>
          <div className="flex items-center space-x-2">
            {bulkActions.map((action) => (
              <Button
                className="h-8"
                key={action.label}
                onClick={() => {
                  action.onClick(selectedRows.map((row) => row.original));
                  table.toggleAllRowsSelected(false);
                }}
                size="sm"
                variant={action.variant ?? 'secondary'}
              >
                {action.icon}
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-center space-x-2">
          <Input
            className="h-8 w-[150px] lg:w-[250px]"
            onChange={(event) => {
              setGlobalFilter(String(event.target.value));
            }}
            placeholder={`Filter ${entityName}...`}
            value={globalFilter ?? ''}
          />
          {globalFilter && (
            <Button className="h-8 px-2 lg:px-3" onClick={() => setGlobalFilter('')} variant="ghost">
              Reset
              <X />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
