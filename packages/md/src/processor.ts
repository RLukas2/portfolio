import rehypeShiki from '@shikijs/rehype';
import {
  transformerMetaWordHighlight,
  transformerNotationDiff,
  transformerNotationHighlight,
} from '@shikijs/transformers';
import { stripMarkdown } from '@xbrk/utils';
import type { Element, Root, Text } from 'hast';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeKatex from 'rehype-katex';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
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
  const sanitizeSchema = structuredClone(defaultSchema);
  sanitizeSchema.attributes?.['*']?.push('style');

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
      // Sanitize output to prevent XSS before caching
      .use(rehypeSanitize, sanitizeSchema)
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

/**
 * Current rendering version.
 * Increment when the processor pipeline changes (new plugins, themes, etc.)
 * to invalidate cached HAST trees that need regeneration.
 */
export const RENDERING_VERSION = 1;

/**
 * Processes markdown source through the full unified pipeline and returns
 * a serialized HAST JSON string suitable for storage and later rendering.
 *
 * Strips position data to reduce storage size.
 * Includes sanitization to prevent XSS.
 */
export async function markdownToHastJson(source: string): Promise<string> {
  const processor = createProcessor();
  const file = await processor.process(source);
  return JSON.stringify(file.result, (key, value) => (key === 'position' ? undefined : value));
}

export interface TOCEntry {
  depth: number;
  title: string;
  url: string;
}

const HEADING_REGEX = /^h[1-6]$/;

/**
 * Extracts a table of contents from a serialized HAST JSON string.
 * Traverses the pre-rendered HAST tree looking for heading elements,
 * avoiding the need to re-parse the markdown source with a separate library.
 */
export function getTOCFromHast(rendering: string | null): TOCEntry[] {
  if (!rendering) {
    return [];
  }

  try {
    const tree = JSON.parse(rendering) as Root;
    const toc: TOCEntry[] = [];

    function walk(node: Root | Element) {
      if (node.type === 'element' && HEADING_REGEX.test(node.tagName)) {
        const depth = Number(node.tagName[1]);
        const id = (node.properties?.id as string) ?? '';
        let title = '';

        function extractText(n: Root | Element | Text): void {
          if (n.type === 'text') {
            title += n.value;
          } else if (n.type === 'element' && n.children) {
            for (const child of n.children) {
              extractText(child as Text);
            }
          }
        }
        for (const child of node.children) {
          extractText(child as Text);
        }

        toc.push({ depth, title: stripMarkdown(title), url: id });
      }

      if (node.type === 'element' && node.children) {
        for (const child of node.children) {
          walk(child as Element);
        }
      }
    }

    if (tree.children) {
      for (const child of tree.children) {
        walk(child as Element);
      }
    }

    return toc;
  } catch {
    return [];
  }
}
