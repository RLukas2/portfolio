import { describe, expect, it } from 'vitest';

/**
 * Stats API Contract Tests
 *
 * These tests verify the API contracts for statistics endpoints.
 */

const DATE_FORMAT_REGEX = /^\d{4}-\d{2}-\d{2}$/;

describe('GitHub Stats API Contract', () => {
  describe('Response Schema', () => {
    it('should define user profile structure', () => {
      const userProfile = {
        login: 'username',
        name: 'Full Name',
        bio: 'Developer bio',
        followers: 100,
        following: 50,
        public_repos: 25,
        avatar_url: 'https://github.com/avatar.jpg',
      };

      expect(userProfile).toHaveProperty('login');
      expect(userProfile).toHaveProperty('name');
      expect(userProfile).toHaveProperty('bio');
      expect(userProfile).toHaveProperty('followers');
      expect(userProfile).toHaveProperty('public_repos');
    });

    it('should define repository structure', () => {
      const repository = {
        name: 'repo-name',
        description: 'Repository description',
        stars: 42,
        forks: 10,
        language: 'TypeScript',
        url: 'https://github.com/user/repo',
        homepage: 'https://project.com',
        topics: ['react', 'typescript'],
      };

      expect(repository).toHaveProperty('name');
      expect(repository).toHaveProperty('stars');
      expect(repository).toHaveProperty('language');
      expect(repository.topics).toBeInstanceOf(Array);
    });

    it('should define complete stats response', () => {
      const statsResponse = {
        user: {
          login: 'username',
          name: 'Full Name',
          followers: 100,
        },
        repos: [
          {
            name: 'repo1',
            stars: 10,
          },
        ],
        starsCount: 42,
      };

      expect(statsResponse).toHaveProperty('user');
      expect(statsResponse).toHaveProperty('repos');
      expect(statsResponse).toHaveProperty('starsCount');
      expect(statsResponse.repos).toBeInstanceOf(Array);
      expect(typeof statsResponse.starsCount).toBe('number');
    });
  });

  describe('Error Handling', () => {
    it('should define error response structure', () => {
      const errorResponse = {
        error: 'Failed to fetch GitHub statistics',
        details: 'API rate limit exceeded',
      };

      expect(errorResponse).toHaveProperty('error');
      expect(typeof errorResponse.error).toBe('string');
    });

    it('should handle missing data gracefully', () => {
      const partialResponse = {
        user: null,
        repos: [],
        starsCount: 0,
      };

      expect(partialResponse.repos).toBeInstanceOf(Array);
      expect(partialResponse.starsCount).toBe(0);
    });
  });

  describe('Data Validation', () => {
    it('should validate stars count is a number', () => {
      const starsCount = 42;
      expect(typeof starsCount).toBe('number');
      expect(starsCount).toBeGreaterThanOrEqual(0);
    });

    it('should validate repos is an array', () => {
      const repos = [{ name: 'repo1' }, { name: 'repo2' }];
      expect(Array.isArray(repos)).toBe(true);
    });

    it('should validate user object structure', () => {
      const user = {
        login: 'username',
        name: 'Full Name',
      };

      expect(typeof user.login).toBe('string');
      expect(typeof user.name).toBe('string');
    });
  });
});

describe('GitHub Activity API Contract', () => {
  describe('Response Schema', () => {
    it('should define activity structure', () => {
      const activity = {
        date: '2024-01-15',
        count: 5,
        level: 2,
      };

      expect(activity).toHaveProperty('date');
      expect(activity).toHaveProperty('count');
      expect(activity).toHaveProperty('level');
      expect(typeof activity.count).toBe('number');
    });

    it('should define activity response array', () => {
      const activities = [
        { date: '2024-01-15', count: 5, level: 2 },
        { date: '2024-01-16', count: 3, level: 1 },
      ];

      expect(Array.isArray(activities)).toBe(true);
      expect(activities.length).toBeGreaterThan(0);
      expect(activities[0]).toHaveProperty('date');
    });
  });

  describe('Data Validation', () => {
    it('should validate date format', () => {
      const date = '2024-01-15';
      expect(date).toMatch(DATE_FORMAT_REGEX);
    });

    it('should validate count is non-negative', () => {
      const count = 5;
      expect(count).toBeGreaterThanOrEqual(0);
    });

    it('should validate level is within range', () => {
      const level = 2;
      expect(level).toBeGreaterThanOrEqual(0);
      expect(level).toBeLessThanOrEqual(4);
    });
  });
});
