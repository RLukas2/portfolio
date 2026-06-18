import type { Root } from 'hast';
import type { Components } from 'hast-util-to-jsx-runtime';
import { toJsxRuntime } from 'hast-util-to-jsx-runtime';
import { Fragment, jsx, jsxs } from 'react/jsx-runtime';

export function renderHast(hast: Root, components: Components) {
  return toJsxRuntime(hast, {
    Fragment,
    jsx,
    jsxs,
    components,
  });
}
