import { describe, expect, it } from 'vitest';
import { isLiked, like, view } from '../article-engagement.service';

describe('article-engagement.service', () => {
  it('exports all expected functions', () => {
    expect(like).toBeDefined();
    expect(isLiked).toBeDefined();
    expect(view).toBeDefined();
  });

  describe('like', () => {
    it('accepts db, input, headers, and optional session parameters', () => {
      expect(like.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('isLiked', () => {
    it('accepts db, input, and headers parameters', () => {
      expect(isLiked.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('view', () => {
    it('accepts db and input parameters', () => {
      expect(view.length).toBeGreaterThanOrEqual(2);
    });
  });
});
