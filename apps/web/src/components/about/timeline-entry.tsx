import { cn } from '@xbrk/ui';

interface TimelineEntryAccomplishmentsProps {
  accomplishments: string[];
  className?: string;
}

/**
 * TimelineEntryAccomplishments component displays a list of accomplishments.
 *
 * Renders a bulleted list of accomplishments with custom bullet styling.
 * Used in both experience and education timeline entries.
 *
 * @param accomplishments - Array of accomplishment strings to display
 * @param className - Optional additional CSS classes
 * @returns List of accomplishments with custom bullet points, or null if empty
 *
 * @example
 * ```tsx
 * <TimelineEntryAccomplishments
 *   accomplishments={[
 *     'Led team of 5 developers',
 *     'Increased performance by 40%'
 *   ]}
 * />
 * ```
 */
export const TimelineEntryAccomplishments = ({
  accomplishments,
  className,
}: TimelineEntryAccomplishmentsProps): React.ReactNode => {
  if (!accomplishments.length) {
    return null;
  }

  return (
    <ul className={cn('my-2 space-y-2 pl-0', className)}>
      {accomplishments.map((accomplishment) => (
        <li
          className="relative list-none pl-4 text-muted-foreground text-sm leading-relaxed before:absolute before:top-2 before:left-0 before:h-1.5 before:w-1.5 before:rounded-full before:bg-primary/50"
          key={accomplishment}
        >
          {accomplishment}
        </li>
      ))}
    </ul>
  );
};

interface TimelineEntryMetaItemProps {
  children: React.ReactNode;
  icon: React.ReactNode;
}

/**
 * TimelineEntryMetaItem component displays metadata with an icon.
 *
 * A reusable component for displaying metadata items (dates, location, etc.)
 * with an icon prefix. Used in timeline entries for consistent formatting.
 *
 * @param icon - Icon element to display before the content
 * @param children - Content to display (dates, location, etc.)
 * @returns Metadata item with icon and content
 *
 * @example
 * ```tsx
 * <TimelineEntryMetaItem icon={<CalendarIcon />}>
 *   <span>Jan 2022 - Present</span>
 * </TimelineEntryMetaItem>
 * ```
 */
export const TimelineEntryMetaItem = ({ icon, children }: TimelineEntryMetaItemProps): React.ReactNode => (
  <div className="flex items-center gap-1.5">
    {icon}
    {children}
  </div>
);
