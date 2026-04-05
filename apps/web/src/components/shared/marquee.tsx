import { cn } from '@xbrk/ui';
import { useId } from 'react';

interface MarqueeProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'left' | 'up';
  fade?: boolean;
  loopSize?: number;
  pauseOnHover?: boolean;
  reverse?: boolean;
}

/**
 * Marquee Component
 *
 * Creates a scrolling marquee effect for its children with continuous animation.
 * Supports horizontal and vertical scrolling with optional pause on hover and fade effects.
 *
 * Adapted from temp folder to use current design system and Tailwind utilities.
 *
 * @param children - Content to scroll in the marquee
 * @param direction - Scroll direction: 'left' (horizontal) or 'up' (vertical)
 * @param pauseOnHover - Whether to pause animation on hover
 * @param reverse - Whether to reverse the scroll direction
 * @param fade - Whether to apply fade effect at edges for seamless appearance
 * @param className - Additional CSS classes for the container
 * @param loopSize - Number of times to duplicate children for continuous effect
 * @returns Animated marquee container with scrolling content
 */
export function Marquee({
  children,
  direction = 'left',
  pauseOnHover = false,
  reverse = false,
  fade = false,
  className,
  loopSize = 2,
}: MarqueeProps) {
  const id = useId();
  const loops = Array.from({ length: loopSize }, (_, i) => `${id}-${i}`);
  const linearGradientDirectionClass = direction === 'left' ? 'to right' : 'to bottom';

  return (
    <div
      className={cn('group flex gap-4 overflow-hidden', direction === 'left' ? 'flex-row' : 'flex-col', className)}
      style={{
        maskImage: fade
          ? `linear-gradient(${linearGradientDirectionClass}, transparent 0%, rgba(0, 0, 0, 1.0) 10%, rgba(0, 0, 0, 1.0) 90%, transparent 100%)`
          : undefined,
        WebkitMaskImage: fade
          ? `linear-gradient(${linearGradientDirectionClass}, transparent 0%, rgba(0, 0, 0, 1.0) 10%, rgba(0, 0, 0, 1.0) 90%, transparent 100%)`
          : undefined,
      }}
    >
      {loops.map((key) => (
        <div
          className={cn(
            'flex shrink-0 justify-around gap-4 [--gap:1rem]',
            direction === 'left' ? 'animate-marquee-left flex-row' : 'animate-marquee-up flex-col',
            pauseOnHover && 'group-hover:[animation-play-state:paused]',
            reverse && 'direction-reverse',
          )}
          key={key}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
