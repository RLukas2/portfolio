import { Badge } from '@xbrk/ui/badge';
import { BookOpenIcon, CalendarIcon, GraduationCapIcon, MapPinIcon } from 'lucide-react';

import Link from '@/components/shared/link';
import type { Education } from '@/lib/types/resume';
import { calculateDuration, formatDateRange } from '@/lib/utils/timeline-utils';

import TimelineCard from './timeline-card';
import { TimelineEntryAccomplishments, TimelineEntryMetaItem } from './timeline-entry';

interface EducationEntryProps {
  education: Education;
}

/**
 * EducationEntry component displays a single education entry in the career timeline.
 *
 * Renders an education entry with institution information, degree, field of study,
 * dates, and accomplishments. Uses TimelineCard for consistent styling with experience entries.
 *
 * Features:
 * - Institution logo with fallback graduation cap icon
 * - Institution name with optional external link
 * - Degree and field of study with badge
 * - Date range display
 * - Location information
 * - List of accomplishments (GPA, coursework, awards, etc.)
 *
 * Uses direct Tailwind classes instead of Container component abstraction.
 *
 * @param education - Education data including institution, degree, dates, and accomplishments
 * @returns Education entry component for career timeline
 *
 * @example
 * ```tsx
 * <EducationEntry
 *   education={{
 *     institution: { name: 'University', logo: '/logo.png', ... },
 *     degree: 'Bachelor of Science',
 *     fieldOfStudy: 'Computer Science',
 *     startDate: '2019-09',
 *     endDate: '2023-05',
 *     accomplishments: [...]
 *   }}
 * />
 * ```
 */
const EducationEntry = ({ education }: EducationEntryProps): React.ReactNode => {
  const { institution, degree, fieldOfStudy, startDate, endDate, accomplishments } = education;
  const { start } = calculateDuration(startDate, endDate);

  return (
    <TimelineCard
      fallbackIcon={<GraduationCapIcon className="size-5" />}
      logo={institution.logo}
      logoAlt={institution.name}
      url={institution.url}
    >
      <div className="flex flex-col gap-1">
        <h2 className="m-0! font-semibold text-foreground text-lg">
          {institution.url ? (
            <Link
              className="text-foreground transition-colors hover:text-primary"
              href={institution.url}
              target="_blank"
            >
              {institution.name}
            </Link>
          ) : (
            institution.name
          )}
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-muted-foreground">{degree}</span>
          <Badge className="text-xs" variant="outline">
            <BookOpenIcon className="mr-1 size-3" />
            {fieldOfStudy}
          </Badge>
        </div>
      </div>

      <div className="my-2 flex flex-wrap gap-x-4 gap-y-2 text-muted-foreground text-sm">
        <TimelineEntryMetaItem icon={<CalendarIcon className="size-3.5" />}>
          <span>{formatDateRange(start, endDate)}</span>
        </TimelineEntryMetaItem>
        <TimelineEntryMetaItem icon={<MapPinIcon className="size-3.5" />}>
          <span>{institution.location}</span>
        </TimelineEntryMetaItem>
      </div>

      <TimelineEntryAccomplishments accomplishments={accomplishments || []} />
    </TimelineCard>
  );
};

export default EducationEntry;
