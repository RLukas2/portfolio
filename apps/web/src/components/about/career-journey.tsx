import { cn } from '@xbrk/ui';
import { Button } from '@xbrk/ui/button';
import { format } from 'date-fns';
import { DownloadIcon } from 'lucide-react';

import Link from '@/components/shared/link';
import { EDUCATION } from '@/lib/data/education';
import { EXPERIENCES } from '@/lib/data/experiences';
import type { Experience } from '@/lib/types/resume';

import EducationEntry from './education-entry';
import ExperienceEntry from './experience-entry';

interface CareerJourneyProps {
  downloadButton?: boolean;
  header?: boolean;
}

/**
 * CareerJourney component displays a combined timeline of work experiences and education.
 *
 * This component merges work experiences and education entries into a single chronological
 * timeline, sorted by start date (most recent first). It provides a comprehensive view
 * of professional and educational background.
 *
 * Features:
 * - Combined timeline of experiences and education
 * - Chronological sorting (most recent first)
 * - Optional header with last updated date
 * - Optional download button for resume PDF
 * - Empty state with styled message when no entries exist
 * - Responsive design with proper spacing
 *
 * Uses direct Tailwind classes instead of Container component abstraction.
 *
 * Data is sourced from:
 * - @/lib/data/experiences - Work experience entries
 * - @/lib/data/education - Education entries
 *
 * @param header - Whether to display the header with last updated date (default: false)
 * @param downloadButton - Whether to display the download PDF button (default: false)
 * @returns Career timeline component with experiences and education
 *
 * @example
 * ```tsx
 * // Basic usage in About page
 * <CareerJourney />
 *
 * // With header and download button in Resume page
 * <CareerJourney header downloadButton />
 * ```
 */
const CareerJourney = ({ header, downloadButton }: CareerJourneyProps): React.ReactNode => {
  /**
   * Last updated date formatted as a string.
   * Update this date whenever you make changes to your resume data.
   */
  const lastUpdated = format(new Date('2025-11-30'), 'MMM dd, yyyy');

  /**
   * Type guard to check if an entry is an experience (vs education).
   * Used for discriminating between the two types in the combined timeline.
   */
  const isExperience = (entry: Experience | (typeof EDUCATION)[number]): entry is Experience => {
    return 'company' in entry && 'role' in entry;
  };

  // Combine experiences and education into a single timeline
  const timelineEntries = [
    ...EXPERIENCES.map((exp) => ({ ...exp, type: 'experience' as const })),
    ...EDUCATION.map((edu) => ({ ...edu, type: 'education' as const })),
  ].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

  return (
    <div className="space-y-8">
      {/* Header with download button */}
      {header && (
        <div className="flex items-center justify-between">
          <div>
            <p className="my-1! text-muted-foreground text-sm">
              Last updated:{' '}
              <time className="font-medium" dateTime={lastUpdated}>
                {lastUpdated}
              </time>
            </p>
          </div>
          {downloadButton && (
            <Button asChild size="default" variant="default">
              <Link className="gap-x-2" href="/share/resume.pdf" target="_blank">
                <DownloadIcon className="size-4" />
                Download PDF
              </Link>
            </Button>
          )}
        </div>
      )}

      {timelineEntries && timelineEntries.length > 0 ? (
        <div className="relative">
          {/* Timeline entries */}
          <ol className="m-0 list-none space-y-6 p-0">
            {timelineEntries.map((entry) => {
              if (isExperience(entry)) {
                return (
                  <ExperienceEntry
                    experience={entry}
                    key={`exp-${entry.company.name}-${entry.role}-${entry.startDate}`}
                  />
                );
              }
              return (
                <EducationEntry
                  education={entry}
                  key={`edu-${entry.institution.name}-${entry.degree}-${entry.startDate}`}
                />
              );
            })}
          </ol>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16">
          <h3 className={cn('font-semibold text-4xl', 'animate-pulse')}>No Timeline Entries Found</h3>
          <p className="mt-4 text-center text-muted-foreground">
            It seems there are no career experiences or education entries to display at the moment...
          </p>
        </div>
      )}
    </div>
  );
};

export default CareerJourney;
