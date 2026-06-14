import { type Bookmark } from '@xbrk/types';
import { m } from 'framer-motion';
import BookmarkCard from '@/components/bookmarks/bookmark-card';
import LoadMore from '@/components/bookmarks/load-more';
import { PAGE_SIZE } from '@/lib/integrations/raindrop';

interface BookmarkListProps {
  id: number;
  initialBookmarks: Bookmark[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

export default function BookmarkList({ id, initialBookmarks }: Readonly<BookmarkListProps>) {
  const isLoadMoreEnabled = PAGE_SIZE <= initialBookmarks.length;

  return (
    <div className="space-y-8">
      <m.div animate="visible" className="grid gap-4 sm:grid-cols-2" initial={false} variants={containerVariants}>
        {initialBookmarks.map((bookmark) => (
          <m.div key={bookmark._id} variants={itemVariants}>
            <BookmarkCard bookmark={bookmark} />
          </m.div>
        ))}
      </m.div>

      {isLoadMoreEnabled && <LoadMore id={id} />}
    </div>
  );
}
