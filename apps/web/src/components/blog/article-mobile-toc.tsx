import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@xbrk/ui/sheet';
import { List } from 'lucide-react';
import TableOfContents from '@/components/blog/toc';
import type { TOC } from '@/types/misc';

interface ArticleMobileTocProps {
  toc: TOC[];
}

const ArticleMobileToc = ({ toc }: ArticleMobileTocProps) => {
  if (!(toc && toc.length > 0)) {
    return null;
  }

  return (
    <div className="fixed right-6 bottom-6 z-40 xl:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <button
            aria-label="Table of Contents"
            className="flex size-14 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform hover:scale-105 active:scale-95"
            type="button"
          >
            <List className="size-6" />
          </button>
        </SheetTrigger>
        <SheetContent className="max-h-[85vh] rounded-t-2xl pb-8" side="bottom">
          <SheetHeader className="pt-2 pb-4">
            <SheetTitle className="text-left text-lg">Table of Contents</SheetTitle>
          </SheetHeader>
          <TableOfContents isMobile toc={toc} />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ArticleMobileToc;
