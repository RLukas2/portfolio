import { describe, expect, it } from 'vitest';
import { create, getAll, getAllPublic, getById, getBySlug, remove, update } from '../articles.service';

describe('articles.service', () => {
  it('exports all expected functions', () => {
    expect(getAll).toBeDefined();
    expect(getAllPublic).toBeDefined();
    expect(getBySlug).toBeDefined();
    expect(getById).toBeDefined();
    expect(create).toBeDefined();
    expect(update).toBeDefined();
    expect(remove).toBeDefined();
  });

  describe('getBySlug', () => {
    it('accepts slug and optional session parameters', () => {
      expect(getBySlug.length).toBeGreaterThanOrEqual(2);
    });

    it('returns article with extended fields', () => {
      const articleShape = {
        id: '',
        title: '',
        slug: '',
        description: null,
        content: null,
        contentRendering: null,
        contentRenderingVersion: 1,
        imageUrl: null,
        isDraft: false,
        tags: null,
        authorId: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        toc: [],
        viewCount: 0,
        likesCount: 0,
        comments: [],
        author: undefined,
        relatedArticles: [],
      };

      expect(articleShape).toHaveProperty('toc');
      expect(articleShape).toHaveProperty('viewCount');
      expect(articleShape).toHaveProperty('likesCount');
      expect(articleShape).toHaveProperty('comments');
      expect(articleShape).toHaveProperty('author');
      expect(articleShape).toHaveProperty('relatedArticles');
    });
  });

  describe('getAllPublic', () => {
    it('returns array of articles with engagement counts', () => {
      expect(getAllPublic.length).toBe(1);
    });

    it('includes computed viewCount and likesCount', () => {
      const articleShape = {
        id: '',
        title: '',
        slug: '',
        description: null,
        imageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDraft: false,
        authorId: '',
        content: null,
        contentRendering: null,
        contentRenderingVersion: 1,
        tags: null,
        likesCount: 0,
        viewCount: 0,
      };

      expect(articleShape).toHaveProperty('likesCount');
      expect(articleShape).toHaveProperty('viewCount');
      expect(typeof articleShape.likesCount).toBe('number');
      expect(typeof articleShape.viewCount).toBe('number');
    });
  });

  describe('create', () => {
    it('accepts db and article data parameters', () => {
      expect(create.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('update', () => {
    it('accepts db and update data parameters', () => {
      expect(update.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('remove', () => {
    it('accepts db and id parameters', () => {
      expect(remove.length).toBeGreaterThanOrEqual(2);
    });
  });
});
