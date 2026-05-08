import { cn } from '@xbrk/ui';

interface RenderedContentProps {
  className?: string;
  html: string;
}

/**
 * Renders pre-processed HTML from `processMarkdownToHtml`.
 * Zero client-side processing — the HTML is already fully rendered including
 * syntax highlighting from Shiki.
 *
 * Only use with trusted content (your own DB content or local files).
 *
 * @example
 * <RenderedContent html={article.renderedContent} className="prose prose-slate dark:prose-invert" />
 */
export function RenderedContent({ html, className }: Readonly<RenderedContentProps>) {
  return (
    <div
      className={cn('markdown-content', className)}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: content is processed server-side from trusted sources only
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
