import { Markdown } from '@xbrk/md';
import { cn } from '@xbrk/ui';
import { type ComponentProps, memo } from 'react';

type ResponseProps = ComponentProps<typeof Markdown>;

export const Response = memo(
  ({ className, ...props }: ResponseProps) => (
    <Markdown className={cn('size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0', className)} {...props} />
  ),
  (prevProps, nextProps) => prevProps.source === nextProps.source,
);

Response.displayName = 'Response';
