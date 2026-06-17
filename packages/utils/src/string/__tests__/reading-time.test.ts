import { describe, expect, it } from 'vitest';
import { calculateReadingTime } from '../reading-time';

describe('calculateReadingTime', () => {
  it('returns 1 for a short text', () => {
    const text = 'hello world';
    expect(calculateReadingTime(text)).toBe(1);
  });

  it('returns correct minutes for 400 words', () => {
    const words = Array.from({ length: 400 }, (_, i) => `word${i}`).join(' ');
    expect(calculateReadingTime(words)).toBe(2);
  });

  it('handles empty string', () => {
    expect(calculateReadingTime('')).toBe(0);
  });

  it('handles text with multiple consecutive whitespace', () => {
    const text = 'hello    world\n\n\nfoo  bar';
    expect(calculateReadingTime(text)).toBe(1);
  });
});
