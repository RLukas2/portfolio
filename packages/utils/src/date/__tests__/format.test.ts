import { describe, expect, it } from 'vitest';
import { formatDate } from '../format';

describe('formatDate', () => {
  it('formats a date string', () => {
    expect(formatDate('2025-01-01')).toBe('January 1, 2025');
  });

  it('formats a timestamp', () => {
    expect(formatDate(1_735_689_600_000)).toBe('January 1, 2025');
  });

  it('formats a Date object', () => {
    expect(formatDate(new Date('2025-06-15'))).toBe('June 15, 2025');
  });

  it('supports custom locale', () => {
    expect(formatDate('2025-01-01', 'de-DE')).toBe('1. Januar 2025');
  });

  it('handles invalid date gracefully', () => {
    const result = formatDate('not-a-date');
    expect(result).toBe('Invalid Date');
  });
});
