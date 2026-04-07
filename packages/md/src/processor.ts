import rehypeShiki from '@shikijs/rehype';
import {
  transformerMetaWordHighlight,
  transformerNotationDiff,
  transformerNotationHighlight,
} from '@shikijs/transformers';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import remarkEmoji from 'remark-emoji';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

/**
 * Cached processor instance for performance.
 * Unified processors are expensive to create and meant to be reused.
 */
let cachedProcessor: ReturnType<typeof createProcessorInternal> | null = null;

function createProcessorInternal() {
  return (
    unified()
      // Parse markdown to mdast
      .use(remarkParse)

      // Remark plugins (markdown transformations)
      .use(remarkGfm) // GitHub Flavored Markdown (tables, strikethrough, footnotes, task lists)
      .use(remarkMath) // Math syntax ($...$, $$...$$)
      .use(remarkEmoji) // Emoji shortcodes (:smile:)

      // Convert mdast to hast (markdown AST → HTML AST)
      .use(remarkRehype, { allowDangerousHtml: true })

      // Rehype plugins (HTML transformations)
      .use(rehypeKatex) // Render KaTeX math
      .use(rehypeSlug) // Add IDs to headings
      .use(rehypeAutolinkHeadings, {
        // Add links to headings
        behavior: 'wrap',
        properties: {
          className: ['heading-link'],
        },
      })
      .use(rehypeShiki, {
        themes: {
          light: 'github-light',
          dark: 'one-dark-pro',
        },
        defaultColor: 'dark',
        transformers: [transformerNotationDiff(), transformerNotationHighlight(), transformerMetaWordHighlight()],
      })
      // Identity compiler to allow .process() to work
      // biome-ignore lint/suspicious/noExplicitAny: Unified plugin API requires dynamic this context
      .use(function (this: any) {
        // biome-ignore lint/suspicious/noExplicitAny: Compiler function signature requires any for tree parameter
        this.Compiler = (tree: any) => tree;
      })
  );
}

/**
 * Creates or returns the cached unified processor with all markdown plugins.
 * This processor converts markdown to HTML AST (hast).
 *
 * The processor is cached as a singleton for performance - creating the
 * unified pipeline is expensive and the processor is stateless, so it's
 * safe to reuse across all Markdown components.
 */
export function createProcessor() {
  if (!cachedProcessor) {
    cachedProcessor = createProcessorInternal();
  }
  return cachedProcessor;
}

/**
 * Clears the cached processor.
 * Useful for testing or if you need to recreate the processor with different options.
 */
export function clearProcessorCache(): void {
  cachedProcessor = null;
}
