import rehypeShiki from '@shikijs/rehype';
import {
  transformerMetaWordHighlight,
  transformerNotationDiff,
  transformerNotationHighlight,
} from '@shikijs/transformers';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeKatex from 'rehype-katex';
import rehypeSanitize from 'rehype-sanitize';
import rehypeSlug from 'rehype-slug';
import remarkEmoji from 'remark-emoji';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { buildSanitizeSchema } from './sanitize-schema';

export interface ProcessorOptions {
  preview?: boolean;
}

const processorCache = new Map<string, ReturnType<typeof buildFullProcessor>>();

function buildFullProcessor() {
  const sanitizeSchema = buildSanitizeSchema();

  return (
    unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkMath)
      .use(remarkEmoji)
      .use(remarkRehype, {
        // Policy: raw HTML in markdown is not supported.
        // Without allowDangerousHtml (default: false), raw HTML tags
        // are not preserved. No rehype-raw is needed.
      })
      .use(rehypeSanitize, sanitizeSchema)
      .use(rehypeKatex)
      .use(rehypeSlug)
      .use(rehypeAutolinkHeadings, {
        behavior: 'wrap',
        properties: { className: ['heading-link'] },
      })
      .use(rehypeShiki, {
        themes: { light: 'github-light', dark: 'one-dark-pro' },
        defaultColor: 'dark',
        transformers: [transformerNotationDiff(), transformerNotationHighlight(), transformerMetaWordHighlight()],
      })
      // biome-ignore lint/suspicious/noExplicitAny: Unified plugin API requires dynamic this context
      .use(function (this: any) {
        // biome-ignore lint/suspicious/noExplicitAny: Compiler function signature requires any for tree parameter
        this.Compiler = (tree: any) => tree;
      })
  );
}

function buildPreviewProcessor() {
  const sanitizeSchema = buildSanitizeSchema();

  return (
    unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkMath)
      .use(remarkEmoji)
      .use(remarkRehype, {
        // Policy: raw HTML in markdown is not supported.
      })
      .use(rehypeSanitize, sanitizeSchema)
      .use(rehypeKatex)
      .use(rehypeSlug)
      .use(rehypeAutolinkHeadings, {
        behavior: 'wrap',
        properties: { className: ['heading-link'] },
      })
      // Preview skips only Shiki, the most expensive step, while keeping layout-critical transforms.
      // biome-ignore lint/suspicious/noExplicitAny: Unified plugin API requires dynamic this context
      .use(function (this: any) {
        // biome-ignore lint/suspicious/noExplicitAny: Compiler function signature requires any for tree parameter
        this.Compiler = (tree: any) => tree;
      })
  );
}

export function createProcessor(options?: ProcessorOptions) {
  const key = options?.preview ? 'preview' : 'full';
  let processor = processorCache.get(key);
  if (!processor) {
    const builder = key === 'preview' ? buildPreviewProcessor : buildFullProcessor;
    processor = builder();
    processorCache.set(key, processor);
  }
  return processor;
}

export function clearProcessorCache(): void {
  processorCache.clear();
}
