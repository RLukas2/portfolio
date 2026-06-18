import { cn } from '@xbrk/ui';
import type { Root } from 'hast';
import type { Components } from 'hast-util-to-jsx-runtime';
import { use, useMemo } from 'react';
import { useMergedComponents } from '../hooks/use-merged-components';
import { createProcessor } from '../processor/pipeline';
import { renderHast } from '../utils/render-hast';

export interface MarkdownProps {
  className?: string;
  components?: Partial<Components>;
  onError?: (error: unknown) => void;
  preview?: boolean;
  source: string;
}

export function Markdown({ source, className, components, onError, preview }: Readonly<MarkdownProps>) {
  const mergedComponents = useMergedComponents(components);

  const contentPromise = useMemo(async () => {
    try {
      const processor = createProcessor({ preview });
      const file = await processor.process(source);
      return renderHast(file.result as Root, mergedComponents);
    } catch (error) {
      console.error('Markdown processing error:', error);
      onError?.(error);
      return <p>Error processing markdown content</p>;
    }
  }, [source, mergedComponents, onError, preview]);

  const content = use(contentPromise);

  return <div className={cn('markdown-content', className)}>{content}</div>;
}
