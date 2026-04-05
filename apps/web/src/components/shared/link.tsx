import { Link as TanStackLink } from '@tanstack/react-router';
import { cn } from '@xbrk/ui';
import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import { forwardRef } from 'react';

const linkVariants = cva('transition-colors', {
  variants: {
    variant: {
      default: 'no-underline hover:text-foreground hover:underline',
      bold: 'font-bold hover:text-foreground hover:no-underline',
      muted: 'text-muted-foreground hover:text-foreground',
      nav: 'font-medium hover:text-foreground hover:no-underline',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface LinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>,
    VariantProps<typeof linkVariants> {
  href?: string;
  to?: string;
}

// Props that are safe to pass to TanStack Router Link
type TanStackLinkSafeProps = Omit<LinkProps, 'href' | 'to' | 'className' | 'children' | 'variant' | 'onClick' | 'ref'>;

/**
 * Scrolls to an element with the given hash ID
 * Handles header offset for proper positioning
 */
const scrollToHash = (hash: string) => {
  const id = hash.replace('#', '');
  const element = document.getElementById(id);

  if (element) {
    const headerOffset = 80; // Adjust based on your header height
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  }
};

/**
 * Link Component
 * This component handles internal and external links with appropriate attributes.
 *
 * Variants:
 * - default: Basic link with hover effect (no bold)
 * - bold: Bold link with hover effect (for emphasis)
 * - muted: Muted color link (for secondary links)
 * - nav: Medium weight link (for navigation menus)
 *
 * Hash Navigation:
 * - Uses TanStack Router for proper integration
 * - Adds manual scroll handling for repeated clicks (TanStack Router limitation)
 * - Supports both /#section and #section formats
 *
 * @type {React.ForwardRefExoticComponent<LinkProps & React.RefAttributes<HTMLAnchorElement>>}
 * @param {LinkProps} param0
 * @param {string} param0.href - The URL the link points to.
 * @param {string} param0.to - href fallback from Tanstack Router
 * @param {string} [param0.className] - Additional class names to apply to the link.
 * @param {React.ReactNode} param0.children - The content of the link.
 * @param {string} [param0.variant] - The variant style of the link (default, bold, muted, nav).
 * @param {React.Ref<HTMLAnchorElement>} ref - The ref to be forwarded to the anchor element.
 * @returns {React.ReactNode} The rendered Link component.
 */
const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href: hrefProp, className, children, variant, to, onClick, ...props }, ref) => {
    // Use 'to' if provided, otherwise use 'href'
    const href = to || hrefProp;

    if (!href) {
      throw new Error('Link must have either href or to prop');
    }

    // Internal route with hash (e.g., /#featured-projects)
    // Use TanStack Router Link with hash prop + manual scroll for repeated clicks
    if (href.startsWith('/#')) {
      const hash = href.split('#')[1];

      const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        // Always scroll to hash (handles repeated clicks)
        scrollToHash(`#${hash}`);

        // Call original onClick if provided
        if (onClick) {
          onClick(e);
        }
      };

      return (
        <TanStackLink
          className={cn(linkVariants({ variant, className }))}
          hash={hash}
          onClick={handleClick}
          ref={ref}
          to="/"
          {...(props as TanStackLinkSafeProps)}
        >
          {children}
        </TanStackLink>
      );
    }

    // Internal route - use TanStack Router Link
    if (href.startsWith('/')) {
      return (
        <TanStackLink
          className={cn(linkVariants({ variant, className }))}
          onClick={onClick}
          ref={ref}
          to={href}
          {...(props as TanStackLinkSafeProps)}
        >
          {children}
        </TanStackLink>
      );
    }

    // Hash link on same page (e.g., #section)
    // Use TanStack Router Link with hash prop + manual scroll for repeated clicks
    if (href.startsWith('#')) {
      const hash = href.replace('#', '');

      const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        // Always scroll to hash (handles repeated clicks)
        scrollToHash(`#${hash}`);

        // Call original onClick if provided
        if (onClick) {
          onClick(e);
        }
      };

      return (
        <TanStackLink
          className={cn(linkVariants({ variant, className }))}
          hash={hash}
          onClick={handleClick}
          ref={ref}
          to="/"
          {...(props as TanStackLinkSafeProps)}
        >
          {children}
        </TanStackLink>
      );
    }

    // External link - use regular anchor with security attributes
    return (
      <a
        className={cn(linkVariants({ variant, className }))}
        href={href}
        onClick={onClick}
        ref={ref}
        rel="noopener noreferrer"
        target="_blank"
        {...props}
      >
        {children}
      </a>
    );
  },
);

Link.displayName = 'Link';

export default Link;
