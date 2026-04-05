import { Badge } from '@xbrk/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@xbrk/ui/tooltip';
import { BriefcaseIcon, CalendarIcon, MapPinIcon } from 'lucide-react';

import Link from '@/components/shared/link';
import { getTechStacksByNames } from '@/lib/data/tech-stack';
import type { Experience } from '@/lib/types/resume';
import { calculateDuration, formatDateRange } from '@/lib/utils/timeline-utils';

import TimelineCard from './timeline-card';
import { TimelineEntryAccomplishments, TimelineEntryMetaItem } from './timeline-entry';

interface ExperienceEntryProps {
  experience: Experience;
}

/**
 * ExperienceEntry component displays a single work experience in the career timeline.
 *
 * Renders a work experience entry with company information, role, dates, tech stack,
 * and accomplishments. Uses TimelineCard for consistent styling with education entries.
 *
 * Features:
 * - Company logo with fallback icon
 * - Role title and company name with external link
 * - Job type badge (Full-time, Freelance)
 * - Date range with duration calculation
 * - Location and working arrangement
 * - Tech stack icons with tooltips
 * - List of accomplishments
 *
 * Uses direct Tailwind classes instead of Container component abstraction.
 *
 * @param experience - Work experience data including company, role, dates, and accomplishments
 * @returns Experience entry component for career timeline
 *
 * @example
 * ```tsx
 * <ExperienceEntry
 *   experience={{
 *     company: { name: 'Tech Corp', logo: '/logo.png', ... },
 *     role: 'Senior Engineer',
 *     startDate: '2022-01',
 *     endDate: null,
 *     stacks: [...],
 *     accomplishments: [...]
 *   }}
 * />
 * ```
 */
const ExperienceEntry = ({ experience }: ExperienceEntryProps): React.ReactNode => {
  const { company, role, startDate, endDate, stacks, accomplishments } = experience;
  const { start, durationText } = calculateDuration(startDate, endDate);

  // Get tech stack data with icons from stack names
  const techStacks = getTechStacksByNames(stacks);

  return (
    <TimelineCard
      fallbackIcon={<BriefcaseIcon className="size-5" />}
      logo={company.logo}
      logoAlt={company.name}
      url={company.url}
    >
      <div className="flex flex-col gap-1">
        <h2 className="m-0! font-semibold text-foreground text-lg">{role}</h2>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            className="font-medium text-primary transition-colors hover:text-primary/80"
            href={company.url}
            target="_blank"
          >
            {company.name}
          </Link>
          <Badge className="text-xs" variant="secondary">
            {company.jobType}
          </Badge>
        </div>
      </div>

      <div className="my-2 flex flex-wrap gap-x-4 gap-y-2 text-muted-foreground text-sm">
        <TimelineEntryMetaItem icon={<CalendarIcon className="size-3.5" />}>
          <span>{formatDateRange(start, endDate)}</span>
          <span className="text-muted-foreground/60">·</span>
          <span className="font-medium text-primary/80">{durationText}</span>
        </TimelineEntryMetaItem>
        <TimelineEntryMetaItem icon={<MapPinIcon className="size-3.5" />}>
          <span>{company.location}</span>
          <span className="text-muted-foreground/60">·</span>
          <span>{company.workingArrangement}</span>
        </TimelineEntryMetaItem>
      </div>

      {techStacks.length > 0 && (
        <div className="my-2 flex flex-row flex-wrap gap-1.5">
          {techStacks.map((tech) => (
            <Tooltip key={tech.name}>
              <TooltipTrigger asChild>
                <div className="flex items-center justify-center rounded-lg border border-border p-2 transition-colors hover:bg-secondary">
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    role="img"
                    style={{ color: tech.color }}
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>{tech.icon.title}</title>
                    <path d={tech.icon.path} />
                  </svg>
                </div>
              </TooltipTrigger>
              <TooltipContent>{tech.name}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      )}

      <TimelineEntryAccomplishments accomplishments={accomplishments} />
    </TimelineCard>
  );
};

export default ExperienceEntry;
