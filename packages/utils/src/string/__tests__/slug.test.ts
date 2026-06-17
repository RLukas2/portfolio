import { describe, expect, it } from 'vitest';
import { generateSlug } from '../slug';

describe('generateSlug', () => {
  it('converts to lowercase', () => {
    expect(generateSlug('Hello World')).toBe('hello-world');
  });

  it('removes special characters', () => {
    expect(generateSlug('Hello, World!')).toBe('hello-world');
  });

  it('replaces spaces with hyphens', () => {
    expect(generateSlug('hello world foo')).toBe('hello-world-foo');
  });

  it('collapses consecutive hyphens', () => {
    expect(generateSlug('hello---world')).toBe('hello-world');
  });

  it('trims leading and trailing hyphens', () => {
    expect(generateSlug('--hello-world--')).toBe('hello-world');
  });

  it('handles underscores', () => {
    expect(generateSlug('hello_world')).toBe('hello-world');
  });

  it('handles mixed whitespace', () => {
    expect(generateSlug('hello\tworld\nfoo')).toBe('hello-world-foo');
  });

  it('handles empty string', () => {
    expect(generateSlug('')).toBe('');
  });
});
