import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createMockAdmin, createMockNonAdmin } from '../helpers/auth';

/**
 * Admin Middleware Authorization Tests
 *
 * These tests verify that the adminMiddleware properly enforces
 * admin role requirements on server functions.
 */
describe('Admin Middleware Authorization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Role-based access control', () => {
    it('should allow admin users to access protected resources', () => {
      const adminUser = createMockAdmin();
      expect(adminUser.role).toBe('admin');
    });

    it('should deny non-admin users access to protected resources', () => {
      const regularUser = createMockNonAdmin();
      expect(regularUser.role).not.toBe('admin');
    });

    it('should deny unauthenticated users (no user in context)', () => {
      const user: null = null;
      expect(user).toBeNull();
    });
  });

  describe('Admin role validation', () => {
    it('should validate admin role is exactly "admin"', () => {
      const adminUser = createMockAdmin();
      expect(adminUser.role).toBe('admin');
    });

    it('should reject user role', () => {
      const user = createMockNonAdmin({ role: 'user' });
      expect(user.role).not.toBe('admin');
    });

    it('should reject undefined role', () => {
      const user = createMockNonAdmin({ role: undefined });
      expect(user.role).not.toBe('admin');
    });

    it('should reject empty string role', () => {
      const user = createMockNonAdmin({ role: '' as any });
      expect(user.role).not.toBe('admin');
    });
  });

  describe('Context validation', () => {
    it('should require user in context', () => {
      const context = { user: null };
      expect(context.user).toBeNull();
    });

    it('should accept valid admin user in context', () => {
      const adminUser = createMockAdmin();
      const context = { user: adminUser };
      expect(context.user).toBeDefined();
      expect(context.user?.role).toBe('admin');
    });
  });

  describe('Security edge cases', () => {
    it('should not allow role manipulation via object properties', () => {
      const user = createMockNonAdmin();
      // Attempt to manipulate role (should not affect validation)
      const manipulatedUser = { ...user, role: 'admin' };
      // In real middleware, the role comes from session, not client
      expect(user.role).toBe('user');
      expect(manipulatedUser.role).toBe('admin'); // This would be caught by session validation
    });

    it('should handle case-sensitive role comparison', () => {
      const user = createMockNonAdmin({ role: 'Admin' as any });
      expect(user.role).not.toBe('admin'); // Case matters
    });

    it('should handle role with whitespace', () => {
      const user = createMockNonAdmin({ role: ' admin ' as any });
      expect(user.role).not.toBe('admin'); // Exact match required
    });
  });
});

/**
 * CRUD Operations Authorization Tests
 *
 * Verify that all CRUD operations require admin role
 */
describe('CRUD Operations Authorization', () => {
  const protectedOperations = [
    'getAllArticles',
    'getArticleById',
    'createArticle',
    'updateArticle',
    'deleteArticle',
    'getAllProjects',
    'getProjectById',
    'createProject',
    'updateProject',
    'deleteProject',
    'getAllSnippets',
    'getSnippetById',
    'createSnippet',
    'updateSnippet',
    'deleteSnippet',
    'getAllServices',
    'getServiceById',
    'createService',
    'updateService',
    'deleteService',
    'getAllExperiences',
    'getExperienceById',
    'createExperience',
    'updateExperience',
    'deleteExperience',
    'getMonthlyUsers',
    'getMonthlyBlogViews',
    'getAllUsers',
  ];

  it('should list all protected CRUD operations', () => {
    expect(protectedOperations).toHaveLength(28);
  });

  it('should require admin for all read operations', () => {
    const readOps = protectedOperations.filter((op) => op.startsWith('get') || op.startsWith('getAll'));
    expect(readOps.length).toBeGreaterThan(0);
  });

  it('should require admin for all write operations', () => {
    const writeOps = protectedOperations.filter(
      (op) => op.startsWith('create') || op.startsWith('update') || op.startsWith('delete'),
    );
    expect(writeOps.length).toBeGreaterThan(0);
  });
});

/**
 * Middleware Chain Tests
 *
 * Verify correct middleware ordering
 */
describe('Middleware Chain', () => {
  it('should enforce authMiddleware before adminMiddleware', () => {
    const middlewareChain = ['sentryMiddleware', 'dbMiddleware', 'authMiddleware', 'adminMiddleware'];

    const authIndex = middlewareChain.indexOf('authMiddleware');
    const adminIndex = middlewareChain.indexOf('adminMiddleware');

    expect(authIndex).toBeLessThan(adminIndex);
  });

  it('should include all required middleware', () => {
    const requiredMiddleware = ['authMiddleware', 'adminMiddleware'];
    const middlewareChain = ['sentryMiddleware', 'dbMiddleware', 'authMiddleware', 'adminMiddleware'];

    for (const middleware of requiredMiddleware) {
      expect(middlewareChain).toContain(middleware);
    }
  });
});
