import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Custom hook to detect if the user has scrolled past a certain threshold.
 * Uses requestAnimationFrame for optimized performance.
 *
 * @param threshold - The scroll threshold in pixels (default: 0)
 * @returns True if the user has scrolled past the threshold, false otherwise
 *
 * @example
 * ```tsx
 * const isScrolled = useScroll(50);
 * return (
 *   <header className={cn(isScrolled && "shadow-lg")}>
 *     ...
 *   </header>
 * );
 * ```
 */
export const useScroll = (threshold = 0): boolean => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const ticking = useRef(false);

  const onScroll = useCallback(() => {
    if (!ticking.current) {
      window.requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > threshold);
        ticking.current = false;
      });
      ticking.current = true;
    }
  }, [threshold]);

  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => window.removeEventListener('scroll', onScroll);
  }, [onScroll]);

  return isScrolled;
};
