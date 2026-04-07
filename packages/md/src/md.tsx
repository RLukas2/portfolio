import { cn } from '@xbrk/ui';
import type { Root } from 'hast';
import type { Components } from 'hast-util-to-jsx-runtime';
import { toJsxRuntime } from 'hast-util-to-jsx-runtime';
import { use, useMemo } from 'react';
import { Fragment, jsx, jsxs } from 'react/jsx-runtime';
import { components as defaultComponents } from './md-components';
import { createProcessor } from './processor';

interface MarkdownProps {
  className?: string;
  components?: Partial<Components>;
  onError?: (error: unknown) => void;
  source: string;
}

/**
 * Unified-based markdown renderer.
 * Supports GFM, math equations, emoji, syntax highlighting, and more.
 *
 * @param source - Markdown content to render
 * @param className - Optional CSS class for the wrapper div
 * @param components - Optional custom components to override defaults
 * @param onError - Optional error handler
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Markdown source={content} />
 *
 * // With custom components
 * <Markdown
 *   source={content}
 *   components={{
 *     h1: (props) => <h1 className="custom-h1" {...props} />,
 *     a: CustomLink,
 *   }}
 * />
 * ```
 */
export function Markdown({ source, className, components, onError }: Readonly<MarkdownProps>) {
  // Merge custom components with defaults
  const mergedComponents = useMemo(() => ({ ...defaultComponents, ...components }), [components]);

  const contentPromise = useMemo(async () => {
    try {
      const processor = createProcessor();
      // process() is async, which is required by Shiki
      const file = await processor.process(source);

      // Convert hast to React elements
      return toJsxRuntime(file.result as Root, {
        Fragment,
        jsx,
        jsxs,
        components: mergedComponents,
      });
    } catch (error) {
      console.error('Markdown processing error:', error);
      onError?.(error);
      return <p>Error processing markdown content</p>;
    }
  }, [source, mergedComponents, onError]);

  // Wait for the async content to resolve
  const content = use(contentPromise);

  return <div className={cn('markdown-content', className)}>{content}</div>;
}
