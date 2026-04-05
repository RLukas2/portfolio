import { useEffect, useLayoutEffect, useState } from 'react';

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

const getMatch = (query: string): MediaQueryList => window.matchMedia(query);

const parseQueryString = (query: string): string => query.replaceAll('@media only screen and', '').trim();

/**
 * Custom hook to evaluate and respond to media query changes.
 * Useful for responsive behavior in React components.
 *
 * @param query - The media query string to evaluate
 * @param defaultState - The default state before the media query is evaluated (default: false)
 * @returns True if the media query matches, false otherwise
 *
 * @example
 * ```tsx
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * const isDesktop = useMediaQuery('@media only screen and (min-width: 1024px)');
 * ```
 */
export const useMediaQuery = (query: string, defaultState = false): boolean => {
  const [state, setState] = useState(defaultState);
  const parseAndMatch = (q: string) => getMatch(parseQueryString(q));

  useIsomorphicLayoutEffect(() => {
    let mounted = true;
    const mql = parseAndMatch(query);

    const onChange = (): void => {
      if (!mounted) {
        return;
      }
      setState(!!mql.matches);
    };

    if (mql.addEventListener) {
      mql.addEventListener('change', onChange);
    } else {
      mql.addListener(onChange); // iOS 13 and below
    }

    setState(mql.matches);

    return () => {
      mounted = false;

      if (mql.removeEventListener) {
        mql.removeEventListener('change', onChange);
      } else {
        mql.removeListener(onChange); // iOS 13 and below
      }
    };
  }, [query]);

  return state;
};
