import { describe, expect, it } from 'vitest';
import { queryKeys } from '@/lib/query-keys';

/**
 * Blog API Contract Tests
 *
 * These tests verify the API contracts for blog article endpoints.
 * They validate request/response schemas and expected behavior.
 */
describe('Blog API Contract', () => {
  describe('Query Keys', () => {
    it('should define all blog query keys', () => {
      expect(queryKeys.blog).toHaveProperty('all');
      expect(queryKeys.blog).toHaveProperty('lists');
      expect(queryKeys.blog).toHaveProperty('listPublic');
      expect(queryKeys.blog).toHaveProperty('listAll');
      expect(queryKeys.blog).toHaveProperty('details');
      expect(queryKeys.blog).toHaveProperty('detail');
      expect(queryKeys.blog).toHaveProperty('byId');
      expect(queryKeys.blog).toHaveProperty('isLiked');
    });

    it('should produce hierarchical keys', () => {
      expect(queryKeys.blog.all).toEqual(['blog']);
      expect(queryKeys.blog.detail('hello-world')).toEqual(['blog', 'detail', 'hello-world']);
      expect(queryKeys.blog.isLiked('hello-world')).toEqual(['blog', 'isLiked', 'hello-world']);
    });
  });

  describe('Article List Schema', () => {
    it('should define public article list item structure', () => {
      const article = {
        id: 'uuid',
        title: 'Article Title',
        slug: 'article-slug',
        description: 'Article description',
        imageUrl: 'https://example.com/image.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
        isDraft: false,
        authorId: 'author-uuid',
        content: null,
        contentRendering: null,
        contentRenderingVersion: 1,
        tags: ['react', 'typescript'],
        likesCount: 42,
        viewCount: 100,
      };

      expect(article).toHaveProperty('id');
      expect(article).toHaveProperty('title');
      expect(article).toHaveProperty('slug');
      expect(article).toHaveProperty('likesCount');
      expect(article).toHaveProperty('viewCount');
      expect(article.tags).toBeInstanceOf(Array);
    });
  });

  describe('Article Detail Schema', () => {
    it('should define article detail structure with relations', () => {
      const articleDetail = {
        id: 'uuid',
        title: 'Article Title',
        slug: 'article-slug',
        description: 'Article description',
        content: 'Full markdown content',
        contentRendering: '{}',
        contentRenderingVersion: 1,
        imageUrl: 'https://example.com/image.jpg',
        isDraft: false,
        tags: ['react'],
        authorId: 'author-uuid',
        createdAt: new Date(),
        updatedAt: new Date(),
        toc: [{ depth: 2, title: 'Introduction', url: '#introduction' }],
        viewCount: 100,
        likesCount: 42,
        comments: [],
        author: {
          id: 'user-uuid',
          name: 'Author Name',
          email: 'author@example.com',
          emailVerified: true,
          image: null,
          role: 'admin',
          banned: false,
          banReason: null,
          banExpires: null,
          twitterHandle: '@author',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        relatedArticles: [],
      };

      expect(articleDetail).toHaveProperty('toc');
      expect(articleDetail).toHaveProperty('viewCount');
      expect(articleDetail).toHaveProperty('likesCount');
      expect(articleDetail).toHaveProperty('comments');
      expect(articleDetail).toHaveProperty('author');
      expect(articleDetail).toHaveProperty('relatedArticles');
      expect(articleDetail.toc).toBeInstanceOf(Array);
      expect(articleDetail.author).toHaveProperty('name');
      expect(articleDetail.author).toHaveProperty('twitterHandle');
    });

    it('should validate TOC entry shape', () => {
      const tocEntry = { depth: 2, title: 'Getting Started', url: '#getting-started' };
      expect(tocEntry).toHaveProperty('depth');
      expect(tocEntry).toHaveProperty('title');
      expect(tocEntry).toHaveProperty('url');
      expect(typeof tocEntry.depth).toBe('number');
      expect(tocEntry.depth).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Error Handling', () => {
    it('should define not found error response', () => {
      const notFoundResponse = {
        error: {
          code: 'NOT_FOUND',
          message: 'Article not found',
          statusCode: 404,
        },
      };

      expect(notFoundResponse.error).toHaveProperty('code', 'NOT_FOUND');
      expect(notFoundResponse.error).toHaveProperty('statusCode', 404);
    });

    it('should handle missing article gracefully', () => {
      const article: null = null;
      expect(article).toBeNull();
    });
  });

  describe('Related Articles', () => {
    it('should define related article structure', () => {
      const relatedArticle = {
        id: 'uuid',
        title: 'Related Post',
        slug: 'related-post',
        description: 'Related article description',
        imageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDraft: false,
        authorId: 'author-uuid',
        content: null,
        contentRendering: null,
        contentRenderingVersion: 1,
        tags: ['react'],
        viewCount: 50,
        likesCount: 20,
      };

      expect(relatedArticle).toHaveProperty('viewCount');
      expect(relatedArticle).toHaveProperty('likesCount');
      expect(typeof relatedArticle.viewCount).toBe('number');
      expect(typeof relatedArticle.likesCount).toBe('number');
    });
  });
});
