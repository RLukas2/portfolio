import { differenceInMonths, differenceInYears, format } from 'date-fns';

/**
 * Calculates the duration between two dates and returns formatted duration information.
 *
 * This utility function computes the time span between a start date and end date (or current date if ongoing),
 * returning both the parsed dates and a human-readable duration string (e.g., "2 yrs 3 mos").
 *
 * @param startDate - The start date in string format (ISO 8601 recommended)
 * @param endDate - The end date in string format or null for ongoing positions
 * @returns Object containing start date, end date, and formatted duration text
 *
 * @example
 * ```ts
 * const { start, end, durationText } = calculateDuration('2022-01', null);
 * // Returns: { start: Date, end: Date, durationText: "3 yrs 2 mos" }
 * ```
 */
export const calculateDuration = (startDate: string, endDate: string | null) => {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();

  const durationInYears = differenceInYears(end, start);
  const durationInMonths = differenceInMonths(end, start) % 12;

  let durationText = '';

  if (durationInYears > 0) {
    durationText += `${durationInYears} yr${durationInYears > 1 ? 's' : ''} `;
  }

  if (durationInMonths > 0 || durationInYears === 0) {
    durationText += `${durationInMonths} mo${durationInMonths > 1 ? 's' : ''}`;
  }

  return { start, end, durationText: durationText.trim() };
};

/**
 * Formats a date range for display in timeline entries.
 *
 * Converts start and end dates into a human-readable format (e.g., "Jan 2022 - Present").
 * If endDate is null, displays "Present" to indicate an ongoing position.
 *
 * @param start - The start date as a Date object
 * @param endDate - The end date in string format or null for ongoing positions
 * @returns Formatted date range string (e.g., "Jan 2022 - Dec 2024" or "Jan 2022 - Present")
 *
 * @example
 * ```ts
 * const range = formatDateRange(new Date('2022-01'), null);
 * // Returns: "Jan 2022 - Present"
 * ```
 */
export const formatDateRange = (start: Date, endDate: string | null): string => {
  const startFormatted = format(start, 'MMM yyyy');
  const endFormatted = endDate ? format(new Date(endDate), 'MMM yyyy') : 'Present';

  return `${startFormatted} - ${endFormatted}`;
};
