import type { Element, Root, Text } from 'hast';

export interface TOCEntry {
  depth: number;
  title: string;
  url: string;
}

const HEADING_REGEX = /^h[1-6]$/;

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

        toc.push({ depth, title: title.trim(), url: id });
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
