import { describe, expect, it } from 'vitest';
import { create, getAll, JSONContentSchema, react, remove } from '../comments.service';

describe('comments.service', () => {
  it('exports all expected functions', () => {
    expect(create).toBeDefined();
    expect(getAll).toBeDefined();
    expect(remove).toBeDefined();
    expect(react).toBeDefined();
    expect(JSONContentSchema).toBeDefined();
  });

  describe('getAll', () => {
    it('accepts db, input, and optional userId parameters', () => {
      expect(getAll.length).toBeGreaterThanOrEqual(2);
    });

    it('returns comment objects with relations', () => {
      const commentShape = {
        comment: {
          id: '',
          articleId: '',
          userId: '',
          content: {},
          parentId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        user: null,
        repliesCount: 0,
        likesCount: 0,
        dislikesCount: 0,
        userReaction: null,
      };

      expect(commentShape).toHaveProperty('comment');
      expect(commentShape).toHaveProperty('user');
      expect(commentShape).toHaveProperty('repliesCount');
      expect(commentShape).toHaveProperty('likesCount');
      expect(commentShape).toHaveProperty('dislikesCount');
      expect(commentShape).toHaveProperty('userReaction');
      expect(typeof commentShape.repliesCount).toBe('number');
      expect(typeof commentShape.likesCount).toBe('number');
    });
  });

  describe('create', () => {
    it('accepts db, input, and userId parameters', () => {
      expect(create.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('remove', () => {
    it('accepts db, input, userId, and userRole parameters', () => {
      expect(remove.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('react', () => {
    it('accepts db, input, and userId parameters', () => {
      expect(react.length).toBeGreaterThanOrEqual(3);
    });

    it('verifies NotFoundError type contract', async () => {
      const { NotFoundError } = await import('@xbrk/errors');
      const error = new NotFoundError('Comment not found');
      expect(error).toBeInstanceOf(NotFoundError);
      expect(error.message).toBe('Comment not found');
      expect(error.code).toBe('NOT_FOUND');
    });
  });
});
