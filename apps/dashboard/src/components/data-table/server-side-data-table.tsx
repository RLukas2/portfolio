'use no memo';

import { type RankingInfo, rankItem } from '@tanstack/match-sorter-utils';
import type { ColumnDef, FilterFn, PaginationState, SortingState, Updater } from '@tanstack/react-table';
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { Button } from '@xbrk/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@xbrk/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@xbrk/ui/table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useState } from 'react';

declare module '@tanstack/react-table' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

interface ServerSideDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  entityName?: string;
  onPaginationChange: (updaterOrValue: Updater<PaginationState>) => void;
  pagination: PaginationState;
  totalCount: number;
}

const fuzzyFilter: FilterFn<unknown> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);

  addMeta({
    itemRank,
  });

  return itemRank.passed;
};

const PAGE_SIZES = [10, 20, 30, 40, 50] as const;

export function ServerSideDataTable<TData, TValue>({
  columns,
  data,
  pagination,
  onPaginationChange,
  totalCount,
}: Readonly<ServerSideDataTableProps<TData, TValue>>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const pageCount = Math.max(Math.ceil(totalCount / pagination.pageSize), 1);
  const canPreviousPage = pagination.pageIndex > 0;
  const canNextPage = pagination.pageIndex < pageCount - 1;

  const table = useReactTable({
    data,
    columns,
    pageCount,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
  });

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="h-24 text-center" colSpan={columns.length}>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between px-2 py-4">
        <div className="flex-1" />
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="font-medium text-sm">Rows per page</p>
            <Select
              onValueChange={(value) => {
                onPaginationChange({
                  pageIndex: 0,
                  pageSize: Number(value),
                });
              }}
              value={String(pagination.pageSize)}
            >
              <SelectTrigger className="h-8 w-17.5">
                <SelectValue placeholder={String(pagination.pageSize)} />
              </SelectTrigger>
              <SelectContent side="top">
                {PAGE_SIZES.map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-25 items-center justify-center font-medium text-sm">
            Page {pagination.pageIndex + 1} of {pageCount}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              className="hidden h-8 w-8 p-0 lg:flex"
              disabled={!canPreviousPage}
              onClick={() => onPaginationChange((old) => ({ ...old, pageIndex: 0 }))}
              variant="outline"
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft />
            </Button>
            <Button
              className="h-8 w-8 p-0"
              disabled={!canPreviousPage}
              onClick={() =>
                onPaginationChange((old) => ({
                  ...old,
                  pageIndex: Math.max(old.pageIndex - 1, 0),
                }))
              }
              variant="outline"
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft />
            </Button>
            <Button
              className="h-8 w-8 p-0"
              disabled={!canNextPage}
              onClick={() =>
                onPaginationChange((old) => ({
                  ...old,
                  pageIndex: Math.min(old.pageIndex + 1, pageCount - 1),
                }))
              }
              variant="outline"
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight />
            </Button>
            <Button
              className="hidden h-8 w-8 p-0 lg:flex"
              disabled={!canNextPage}
              onClick={() =>
                onPaginationChange((old) => ({
                  ...old,
                  pageIndex: pageCount - 1,
                }))
              }
              variant="outline"
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
