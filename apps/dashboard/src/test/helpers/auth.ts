import type { UserType } from '@xbrk/types';

/**
 * Mock user factory for testing
 */
export function createMockUser(overrides?: Partial<UserType>): UserType {
  return {
    id: 'test-user-id',
    email: 'test@example.com',
    emailVerified: true,
    name: 'Test User',
    image: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    role: 'user',
    banned: false,
    banReason: null,
    banExpires: null,
    twitterHandle: null,
    ...overrides,
  };
}

/**
 * Create a mock admin user
 */
export function createMockAdmin(overrides?: Partial<UserType>): UserType {
  return createMockUser({
    role: 'admin',
    email: 'admin@example.com',
    name: 'Admin User',
    ...overrides,
  });
}

/**
 * Create a mock non-admin user
 */
export function createMockNonAdmin(overrides?: Partial<UserType>): UserType {
  return createMockUser({
    role: 'user',
    email: 'user@example.com',
    name: 'Regular User',
    ...overrides,
  });
}

/**
 * Mock context with user
 */
export function createMockContext(user: UserType | null) {
  return {
    user,
    db: {} as Record<string, unknown>,
  };
}
