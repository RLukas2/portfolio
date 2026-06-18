import type { Components } from 'hast-util-to-jsx-runtime';
import { useMemo } from 'react';
import { components as defaultComponents } from '../components/default-components';

export function useMergedComponents(overrides?: Partial<Components>) {
  return useMemo<Components>(() => ({ ...defaultComponents, ...overrides }) as Components, [overrides]);
}
