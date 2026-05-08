import rehypeShiki from '@shikijs/rehype';
import {
  transformerMetaWordHighlight,
  transformerNotationDiff,
  transformerNotationHighlight,
} from '@shikijs/transformers';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkEmoji from 'remark-emoji';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

/**
 * Cached server-side processor that outputs an HTML string.
 * Separate from the client processor — uses rehype-stringify instead of toJsxRuntime.
 */
let cachedServerProcessor: ReturnType<typeof createServerProcessorInternal> | null = null;

function createServerProcessorInternal() {
  return unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkEmoji)
    .use(remarkRehype, { allowDangerousHtml: true })
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
    .use(rehypeStringify, { allowDangerousHtml: true });
}

function getServerProcessor() {
  if (!cachedServerProcessor) {
    cachedServerProcessor = createServerProcessorInternal();
  }
  return cachedServerProcessor;
}

/**
 * Processes markdown to an HTML string on the server.
 * Call this in server functions / API routes — never in client components.
 *
 * The returned string is safe to pass to `RenderedContent` which renders it
 * with `dangerouslySetInnerHTML`. Only use with content you control (DB content,
 * local files) — not with arbitrary user input without sanitization.
 *
 * @example
 * // In a server function:
 * const html = await processMarkdownToHtml(article.content ?? '');
 * return { ...article, renderedContent: html };
 */
export async function processMarkdownToHtml(source: string): Promise<string> {
  if (!source) {
    return '';
  }
  const processor = getServerProcessor();
  const file = await processor.process(source);
  return String(file);
}
