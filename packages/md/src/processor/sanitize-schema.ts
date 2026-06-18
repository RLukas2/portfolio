import type { Options } from 'rehype-sanitize';
import { defaultSchema } from 'rehype-sanitize';

export function buildSanitizeSchema(): Options {
  const schema = structuredClone(defaultSchema);
  schema.clobberPrefix = '';

  const mathmlTags = [
    'math',
    'semantics',
    'mrow',
    'mi',
    'mo',
    'mn',
    'msup',
    'msub',
    'mfrac',
    'msqrt',
    'mover',
    'munder',
    'mtext',
    'annotation',
    'mtable',
    'mtr',
    'mtd',
    'merror',
    'mpadded',
    'mspace',
    'mstyle',
    'msubsup',
    'munderover',
    'mmultiscripts',
    'mphantom',
    'mroot',
    'menclose',
    'mfenced',
    'mglyph',
    'mlabeledtr',
  ];

  const svgTags = ['svg', 'path', 'g', 'line'];

  schema.tagNames = [...(schema.tagNames ?? []), ...mathmlTags, ...svgTags];

  const wildcardAttrs = schema.attributes?.['*'] ?? [];

  schema.attributes = {
    ...schema.attributes,
    '*': [...wildcardAttrs, 'className', 'id', 'aria-hidden', 'style'],

    svg: ['xmlns', 'viewBox', 'preserveAspectRatio', 'width', 'height', 'style'],
    path: ['d'],
    line: ['x1', 'y1', 'x2', 'y2', 'stroke-width'],

    img: ['src', 'alt', 'width', 'height', 'longDesc'],

    math: ['xmlns', 'display', 'href'],
    mi: ['mathvariant'],
    mo: [
      'stretchy',
      'fence',
      'lspace',
      'rspace',
      'separator',
      'largeop',
      'movablelimits',
      'minsize',
      'maxsize',
      'accent',
      'accentunder',
      'mathcolor',
    ],
    mn: ['mathvariant'],
    mtext: ['mathvariant'],
    mfrac: ['linethickness'],
    mover: ['accent'],
    munder: ['accentunder'],
    munderover: ['accent', 'accentunder'],
    section: ['data-footnotes'],
    sup: ['id'],
    mstyle: ['displaystyle', 'scriptlevel', 'mathcolor', 'mathbackground', 'mathsize', 'style'],
    mpadded: ['width', 'height', 'depth', 'voffset', 'lspace', 'rspace'],
    menclose: ['notation', 'mathbackground', 'style'],
    mspace: ['width', 'height', 'mathbackground', 'linebreak'],
    mtable: ['rowspacing', 'columnalign', 'columnlines', 'columnspacing', 'rowlines', 'width'],
    mtd: ['padleft', 'padright', 'columnalign'],
    mglyph: ['alt', 'src', 'valign', 'width', 'height'],
    annotation: ['encoding'],
  };

  return schema;
}
