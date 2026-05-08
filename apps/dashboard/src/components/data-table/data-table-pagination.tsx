import type { Table } from '@tanstack/react-table';
import { Button } from '@xbrk/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@xbrk/ui/select';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useEffect, useState } from 'react';

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

const PAGE_SIZES = [10, 20, 30, 40, 50] as const;

export function DataTablePagination<TData>({ table }: Readonly<DataTablePaginationProps<TData>>) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const [pageSizeValue, setPageSizeValue] = useState(String(pageSize));

  useEffect(() => {
    setPageSizeValue(String(pageSize));
  }, [pageSize]);

  const totalCount = table.getFilteredRowModel().rows.length;
  const pageCount = Math.max(Math.ceil(totalCount / pageSize), 1);
  const lastPageIndex = Math.max(pageCount - 1, 0);
  const canPreviousPage = pageIndex > 0;
  const canNextPage = pageIndex < lastPageIndex;
  const hasRowSelectionColumn = table.getAllLeafColumns().some((column) => column.id === 'select');
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;
  const hasSelection = hasRowSelectionColumn && selectedCount > 0;

  useEffect(() => {
    if (pageIndex > lastPageIndex) {
      table.setPageIndex(lastPageIndex);
    }
  }, [lastPageIndex, pageIndex, table]);

  return (
    <div className="flex items-center justify-between px-2">
      {hasSelection ? (
        <div className="flex-1 text-muted-foreground text-sm">
          {selectedCount} of {totalCount} row(s) selected.
        </div>
      ) : (
        <div className="flex-1" />
      )}
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="font-medium text-sm">Rows per page</p>
          <Select
            key={pageSizeValue}
            onValueChange={(value) => {
              setPageSizeValue(value);
              table.setPageIndex(0);
              table.setPageSize(Number(value));
            }}
            value={pageSizeValue}
          >
            <SelectTrigger className="h-8 w-17.5">
              <SelectValue placeholder={pageSizeValue} />
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
          Page {Math.min(pageIndex, lastPageIndex) + 1} of {pageCount}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            className="hidden h-8 w-8 p-0 lg:flex"
            disabled={!canPreviousPage}
            onClick={() => table.setPageIndex(0)}
            variant="outline"
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft />
          </Button>
          <Button
            className="h-8 w-8 p-0"
            disabled={!canPreviousPage}
            onClick={() => table.setPageIndex((old) => Math.max(old - 1, 0))}
            variant="outline"
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft />
          </Button>
          <Button
            className="h-8 w-8 p-0"
            disabled={!canNextPage}
            onClick={() => table.setPageIndex((old) => Math.min(old + 1, lastPageIndex))}
            variant="outline"
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight />
          </Button>
          <Button
            className="hidden h-8 w-8 p-0 lg:flex"
            disabled={!canNextPage}
            onClick={() => table.setPageIndex(lastPageIndex)}
            variant="outline"
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
