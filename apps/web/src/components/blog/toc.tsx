import { cn } from '@xbrk/ui';
import { ScrollArea } from '@xbrk/ui/scroll-area';
import { List } from 'lucide-react';
import { useMemo } from 'react';
import useActiveItem from '@/hooks/use-active-item';
import useMounted from '@/hooks/use-mounted';
import type { TOC } from '@/types/misc';

const HASH_REGEX = /^#/;

interface TableOfContentProps {
  isMobile?: boolean;
  toc: TOC[];
}

export default function TableOfContents({ toc, isMobile }: Readonly<TableOfContentProps>) {
  const itemIds = useMemo(() => toc.map((item) => item.url.replace(HASH_REGEX, '')), [toc]);

  const mounted = useMounted();
  const activeHeading = useActiveItem(itemIds);

  if (!(toc && mounted)) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex flex-col',
        isMobile ? '' : 'max-h-[calc(100vh-10rem)] rounded-2xl border border-border/50 bg-card/50 p-5 backdrop-blur-sm',
      )}
    >
      {!isMobile && (
        <div className="flex shrink-0 items-center gap-2 pb-4">
          <List className="h-4 w-4 text-muted-foreground" />
          <p className="font-medium text-sm">On This Page</p>
        </div>
      )}
      <ScrollArea className="w-full">
        <div className={isMobile ? 'max-h-[60vh] pr-4' : 'max-h-[calc(100vh-15rem)]'}>
          <Tree activeItem={activeHeading} tree={toc} />
        </div>
      </ScrollArea>
    </div>
  );
}

interface TreeProps {
  activeItem?: string | null;
  tree: TOC[];
}

const PADDING_LEFT = 12 as const;

function Tree({ tree, activeItem }: TreeProps) {
  const minDepth = Math.min(...tree.map((item) => item.depth));

  return tree?.length ? (
    <ul className="m-0 list-none space-y-1">
      {tree.map((item) => (
        <li key={item.url}>
          <a
            className={cn(
              'block rounded-lg py-1.5 text-sm no-underline transition-all',
              item.url.replace(HASH_REGEX, '') === activeItem
                ? 'bg-primary/10 font-medium text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
            href={`#${item.url}`}
            style={{
              paddingLeft: `${(item.depth - minDepth + 1) * PADDING_LEFT}px`,
              paddingRight: '12px',
            }}
          >
            {item.title}
          </a>
        </li>
      ))}
    </ul>
  ) : null;
}
