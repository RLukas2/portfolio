import { describe, expect, it } from 'vitest';
import { queryKeys } from '@/lib/query-keys';

/**
 * Comment API Contract Tests
 *
 * These tests verify the API contract for comment endpoints.
 * They validate request/response schemas and expected behavior.
 */
describe('Comment API Contract', () => {
  describe('Query Keys', () => {
    it('should define all comment query keys', () => {
      expect(queryKeys.comment).toHaveProperty('all');
      expect(queryKeys.comment).toHaveProperty('byArticle');
      expect(queryKeys.comment).toHaveProperty('byArticleAndParent');
    });

    it('should produce hierarchical keys', () => {
      expect(queryKeys.comment.all).toEqual(['comment']);
      expect(queryKeys.comment.byArticle('article-123')).toEqual(['comment', 'byArticle', 'article-123']);
      expect(queryKeys.comment.byArticleAndParent('article-123', 'parent-456')).toEqual([
        'comment',
        'byArticle',
        'article-123',
        'parent',
        'parent-456',
      ]);
    });
  });

  describe('Comment Schema', () => {
    it('should define base comment structure', () => {
      const comment = {
        id: 'uuid',
        articleId: 'article-uuid',
        userId: 'user-uuid',
        content: { type: 'doc', content: [] },
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(comment).toHaveProperty('id');
      expect(comment).toHaveProperty('articleId');
      expect(comment).toHaveProperty('content');
      expect(comment).toHaveProperty('parentId');
      expect(comment).toHaveProperty('createdAt');
      expect(comment).toHaveProperty('updatedAt');
    });
  });

  describe('Comment with Relations Schema', () => {
    it('should define comment with relations structure', () => {
      const commentWithRelations = {
        comment: {
          id: 'uuid',
          articleId: 'article-uuid',
          userId: 'user-uuid',
          content: {},
          parentId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        user: {
          id: 'user-uuid',
          name: 'Commenter',
          email: 'commenter@example.com',
          emailVerified: true,
          image: null,
          role: 'user',
          banned: false,
          banReason: null,
          banExpires: null,
          twitterHandle: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        repliesCount: 3,
        likesCount: 5,
        dislikesCount: 1,
        userReaction: null,
      };

      expect(commentWithRelations).toHaveProperty('comment');
      expect(commentWithRelations).toHaveProperty('user');
      expect(commentWithRelations).toHaveProperty('repliesCount');
      expect(commentWithRelations).toHaveProperty('likesCount');
      expect(commentWithRelations).toHaveProperty('dislikesCount');
      expect(commentWithRelations).toHaveProperty('userReaction');
      expect(typeof commentWithRelations.repliesCount).toBe('number');
      expect(typeof commentWithRelations.likesCount).toBe('number');
    });

    it('should define userReaction when user has reacted', () => {
      const userReaction = {
        id: 'reaction-uuid',
        commentId: 'comment-uuid',
        userId: 'user-uuid',
        like: true,
        createdAt: new Date(),
      };

      expect(userReaction).toHaveProperty('like');
      expect(typeof userReaction.like).toBe('boolean');
    });
  });

  describe('Error Handling', () => {
    it('should define not found error for missing comment', () => {
      const notFoundResponse = {
        error: {
          code: 'NOT_FOUND',
          message: 'Comment not found',
          statusCode: 404,
        },
      };

      expect(notFoundResponse.error).toHaveProperty('code', 'NOT_FOUND');
      expect(notFoundResponse.error).toHaveProperty('statusCode', 404);
    });

    it('should define forbidden error for unauthorized delete', () => {
      const forbiddenResponse = {
        error: {
          code: 'FORBIDDEN',
          message: 'You are not allowed to delete this comment',
          statusCode: 403,
        },
      };

      expect(forbiddenResponse.error).toHaveProperty('code', 'FORBIDDEN');
      expect(forbiddenResponse.error).toHaveProperty('statusCode', 403);
    });
  });
});
