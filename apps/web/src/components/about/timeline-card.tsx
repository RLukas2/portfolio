import { cn } from '@xbrk/ui';
import { LazyImage } from '@xbrk/ui/lazy-image';

import Link from '@/components/shared/link';

interface TimelineCardProps {
  /** Content to render inside the card */
  children: React.ReactNode;
  /** Additional className for the card */
  className?: string;
  /** Fallback icon when no logo is provided */
  fallbackIcon: React.ReactNode;
  /** Logo URL or null/undefined for fallback icon */
  logo?: string | null;
  /** Alt text for the logo */
  logoAlt: string;
  /** Optional URL to link the logo/title to */
  url?: string | null;
}

/**
 * TimelineCard component for displaying career timeline entries.
 *
 * A reusable card component for timeline entries with consistent styling.
 * Displays a logo (or fallback icon), and renders children content inside a bordered card.
 * Supports hover effects and optional linking to external URLs.
 *
 * Uses direct Tailwind classes instead of Container component abstraction.
 *
 * @param logo - URL to company/institution logo image
 * @param logoAlt - Alt text for the logo image
 * @param fallbackIcon - Icon to display when no logo is provided
 * @param url - Optional URL to link the logo to
 * @param children - Content to render inside the card (title, dates, accomplishments, etc.)
 * @param className - Additional CSS classes for customization
 * @returns Timeline card component with logo and content
 *
 * @example
 * ```tsx
 * <TimelineCard
 *   logo="/company-logo.png"
 *   logoAlt="Company Name"
 *   fallbackIcon={<BriefcaseIcon />}
 *   url="https://company.com"
 * >
 *   <h3>Software Engineer</h3>
 *   <p>Company Name</p>
 * </TimelineCard>
 * ```
 */
const TimelineCard = ({
  logo,
  logoAlt,
  fallbackIcon,
  url,
  children,
  className,
}: TimelineCardProps): React.ReactNode => {
  return (
    <li className="group relative p-0">
      {/* Card content */}
      <div
        className={cn(
          'rounded-xl border border-border/50 p-4 transition-all duration-300 hover:border-border hover:shadow-lg',
          className,
        )}
      >
        {/* Header with logo and title */}
        <div className="mb-3 flex items-start gap-3">
          {/* Logo */}
          <div className="shrink-0">
            {logo && url && (
              <Link className="block" href={url} target="_blank">
                <LazyImage
                  alt={logoAlt}
                  className="rounded-xl object-cover transition-transform hover:scale-105"
                  height={44}
                  src={logo}
                  width={44}
                />
              </Link>
            )}
            {logo && !url && (
              <LazyImage alt={logoAlt} className="rounded-xl object-cover" height={44} src={logo} width={44} />
            )}
            {!logo && (
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                {fallbackIcon}
              </div>
            )}
          </div>

          {/* Title and subtitle area */}
          <div className="flex min-w-0 flex-1 flex-col">{children}</div>
        </div>
      </div>
    </li>
  );
};

export default TimelineCard;
