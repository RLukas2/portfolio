import { cn } from '@xbrk/ui';
import type { Root } from 'hast';
import type { Components } from 'hast-util-to-jsx-runtime';
import { useMemo } from 'react';
import { useMergedComponents } from '../hooks/use-merged-components';
import { renderHast } from '../utils/render-hast';

interface RenderedMarkdownProps {
  className?: string;
  components?: Partial<Components>;
  rendering: string | null;
}

export function RenderedMarkdown({ rendering, className, components }: Readonly<RenderedMarkdownProps>) {
  const mergedComponents = useMergedComponents(components);

  const content = useMemo(() => {
    if (!rendering) {
      return <p>No content</p>;
    }

    try {
      const hast = JSON.parse(rendering) as Root;
      return renderHast(hast, mergedComponents);
    } catch (error) {
      console.error('Rendered markdown error:', error);
      return <p>Error rendering content</p>;
    }
  }, [rendering, mergedComponents]);

  return <div className={cn('markdown-content', className)}>{content}</div>;
}
