import { ValidationError } from '@xbrk/errors';

export interface MonthlyData {
  count: number;
  month: string;
}

export interface RecentActivityItem {
  createdAt: Date;
  id: string;
  title: string;
  type: 'user' | 'article' | 'project';
  url: string;
}

const DEFAULT_MONTHS = 6;
const FIRST_DAY = 1;
const MIN_MONTHS = 1;
const MAX_MONTHS = 24;

export function validateMonths(months?: number): number {
  if (months === undefined) {
    return DEFAULT_MONTHS;
  }

  if (months < MIN_MONTHS || months > MAX_MONTHS) {
    throw new ValidationError(`Months must be between ${MIN_MONTHS} and ${MAX_MONTHS}`);
  }

  return months;
}

export function calculateStartDate(months: number): Date {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), FIRST_DAY));
  start.setUTCMonth(start.getUTCMonth() - (months - 1));
  return start;
}

export function processMonthlyData(
  result: { rows: Record<string, unknown>[] },
  start: Date,
  months: number,
): MonthlyData[] {
  const monthCounts = new Map<string, number>();
  for (const row of result.rows as { month: string; count: number }[]) {
    monthCounts.set(row.month, Number(row.count));
  }

  const data: MonthlyData[] = [];
  const cursor = new Date(start);
  for (let i = 0; i < months; i += 1) {
    const key = `${cursor.getUTCFullYear()}-${String(cursor.getUTCMonth() + 1).padStart(2, '0')}`;
    data.push({ month: key, count: monthCounts.get(key) ?? 0 });
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }

  return data;
}
