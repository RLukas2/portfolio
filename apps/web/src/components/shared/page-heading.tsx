import { Slot } from '@radix-ui/react-slot';
import { cn } from '@xbrk/ui';
import { m } from 'framer-motion';
import type { HTMLAttributes, ReactNode } from 'react';
import { useMemo } from 'react';

const MotionDiv = m.create('div');
const MotionSlot = m.create(Slot);

interface PageHeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  asChild?: boolean;
  centered?: boolean;
  children?: ReactNode;
  description?: string | null;
  hasMotion?: boolean;
  title: string;
}

const PageHeading = ({
  title,
  description,
  asChild,
  centered = false,
  children,
  className,
  hasMotion = true,
}: PageHeadingProps) => {
  const Comp = (() => {
    if (hasMotion) {
      return asChild ? MotionSlot : MotionDiv;
    }
    return asChild ? Slot : 'div';
  })();

  const animation = useMemo(
    () => ({
      hide: centered ? { y: 32, opacity: 0 } : { x: -32, opacity: 0 },
      show: centered ? { y: 0, opacity: 1 } : { x: 0, opacity: 1 },
    }),
    [centered],
  );

  const motionProps = hasMotion ? { animate: animation.show, initial: false, transition: { duration: 0.5 } } : {};

  return (
    <Comp {...motionProps} className={cn('fade-in slide-in-from-left-4 animate-in py-16 duration-500', className)}>
      <div className={cn('relative', { 'flex flex-col items-center': centered })}>
        {/* Decorative gradient */}
        <div
          className={cn(
            'pointer-events-none absolute -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 blur-2xl',
            centered ? '-left-1/2' : '-left-4',
          )}
        />

        <div className={cn('relative space-y-3', { 'text-center': centered })}>
          {hasMotion ? (
            <m.h1
              animate={animation.show}
              className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text font-bold text-4xl text-transparent tracking-tight md:text-5xl lg:text-6xl"
              initial={false}
              transition={{ delay: 0.1 }}
            >
              {title}
            </m.h1>
          ) : (
            <h1 className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text font-bold text-3xl text-transparent tracking-tight md:text-4xl lg:text-5xl">
              {title}
            </h1>
          )}

          {description &&
            (hasMotion ? (
              <m.p
                animate={animation.show}
                className={cn(
                  'text-muted-foreground leading-relaxed md:text-lg',
                  centered ? 'mx-auto max-w-2xl' : 'max-w-2xl',
                )}
                initial={false}
                transition={{ delay: 0.2 }}
              >
                {description}
              </m.p>
            ) : (
              <p
                className={cn(
                  'text-muted-foreground leading-relaxed md:text-lg',
                  centered ? 'mx-auto max-w-2xl' : 'max-w-2xl',
                )}
              >
                {description}
              </p>
            ))}

          {children &&
            (hasMotion ? (
              <m.div
                animate={animation.show}
                className="pointer-events-auto pt-3"
                initial={false}
                transition={{ delay: 0.3 }}
              >
                {children}
              </m.div>
            ) : (
              <div className="pointer-events-auto pt-3">{children}</div>
            ))}
        </div>
      </div>
    </Comp>
  );
};

export default PageHeading;
