import { cn } from '@xbrk/ui';
import { List } from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';
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
      <div
        className={cn('w-full overflow-y-auto', isMobile ? 'max-h-[60vh]' : 'max-h-[calc(100vh-15rem)]')}
        data-toc-scroll
      >
        <div className="pr-4">
          <Tree activeItem={activeHeading} tree={toc} />
        </div>
      </div>
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
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  useEffect(() => {
    if (!activeItem) {
      return;
    }

    const activeElement = itemRefs.current[activeItem];
    const viewport = activeElement?.closest('[data-toc-scroll]');
    if (!(activeElement && viewport instanceof HTMLElement)) {
      return;
    }

    const itemRect = activeElement.getBoundingClientRect();
    const viewportRect = viewport.getBoundingClientRect();
    const scrollPadding = 16;

    if (itemRect.top < viewportRect.top + scrollPadding) {
      viewport.scrollTo({
        behavior: 'smooth',
        top: viewport.scrollTop + itemRect.top - viewportRect.top - scrollPadding,
      });
    } else if (itemRect.bottom > viewportRect.bottom - scrollPadding) {
      viewport.scrollTo({
        behavior: 'smooth',
        top: viewport.scrollTop + itemRect.bottom - viewportRect.bottom + scrollPadding,
      });
    }
  }, [activeItem]);

  return tree?.length ? (
    <ul className="m-0 list-none space-y-1">
      {tree.map((item) => {
        const itemId = item.url.replace(HASH_REGEX, '');

        return (
          <li key={item.url}>
            <a
              className={cn(
                'block rounded-lg py-1.5 text-sm no-underline transition-all',
                itemId === activeItem
                  ? 'bg-primary/10 font-medium text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
              href={`#${itemId}`}
              ref={(element) => {
                itemRefs.current[itemId] = element;
              }}
              style={{
                paddingLeft: `${(item.depth - minDepth + 1) * PADDING_LEFT}px`,
                paddingRight: '12px',
              }}
            >
              {item.title}
            </a>
          </li>
        );
      })}
    </ul>
  ) : null;
}
