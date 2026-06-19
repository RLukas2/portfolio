import { siteConfig } from '@xbrk/config';
import { Tag } from 'lucide-react';
import SocialShare from '@/components/shared/social-share';

interface ArticleTagsShareProps {
  slug: string;
  tags: string[] | null;
  title: string;
}

const ArticleTagsShare = ({ tags, title, slug }: ArticleTagsShareProps) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <Tag className="size-4 text-muted-foreground" />
          {tags.map((tag) => (
            <span
              className="inline-flex items-center rounded-full bg-linear-to-r from-violet-500/10 to-fuchsia-500/10 px-3 py-1 font-medium text-foreground text-xs transition-colors hover:from-violet-500/20 hover:to-fuchsia-500/20"
              key={tag}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      <SocialShare text={`${title} via ${siteConfig.author.handle}`} url={`${siteConfig.url}/blog/${slug}`} />
    </div>
  );
};

export default ArticleTagsShare;
