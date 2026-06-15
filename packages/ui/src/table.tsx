import { cn } from '@xbrk/ui';
import { type ComponentProps } from 'react';

const Table = ({ className, ...props }: ComponentProps<'table'>) => (
  <div className="relative w-full overflow-x-auto" data-slot="table-container">
    {/* @sonar-ignore */}
    <table className={cn('w-full caption-bottom text-sm', className)} data-slot="table" {...props} />
    {/* @end */}
  </div>
);
Table.displayName = "Table";

const TableHeader = ({ className, ...props }: ComponentProps<'thead'>) => (
  <thead className={cn('[&_tr]:border-b', className)} data-slot="table-header" {...props} />
);
TableHeader.displayName = "TableHeader";

const TableBody = ({ className, ...props }: ComponentProps<'tbody'>) => (
  <tbody className={cn('[&_tr:last-child]:border-0', className)} data-slot="table-body" {...props} />
);
TableBody.displayName = "TableBody";

const TableFooter = ({ className, ...props }: ComponentProps<'tfoot'>) => (
  <tfoot
    className={cn('border-t bg-muted/50 font-medium [&>tr]:last:border-b-0', className)}
    data-slot="table-footer"
    {...props}
  />
);
TableFooter.displayName = "TableFooter";

const TableRow = ({ className, ...props }: ComponentProps<'tr'>) => (
  <tr
    className={cn('border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted', className)}
    data-slot="table-row"
    {...props}
  />
);
TableRow.displayName = "TableRow";

const TableHead = ({ className, ...props }: ComponentProps<'th'>) => (
  <th
    className={cn(
      'h-10 whitespace-nowrap px-2 text-left align-middle font-medium text-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
      className,
    )}
    data-slot="table-head"
    {...props}
  />
);
TableHead.displayName = "TableHead";

const TableCell = ({ className, ...props }: ComponentProps<'td'>) => (
  <td
    className={cn(
      'whitespace-nowrap p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
      className,
    )}
    data-slot="table-cell"
    {...props}
  />
);
TableCell.displayName = "TableCell";

const TableCaption = ({ className, ...props }: ComponentProps<'caption'>) => (
  <caption className={cn('mt-4 text-muted-foreground text-sm', className)} data-slot="table-caption" {...props} />
);
TableCaption.displayName = "TableCaption";

export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow };
