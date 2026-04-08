import { afterAll, afterEach, beforeAll } from 'vitest';

// Setup environment variables for testing
beforeAll(() => {
  process.env.NODE_ENV = 'test';
});

// Cleanup after each test
afterEach(() => {
  // Reset any mocks or state
});

afterAll(() => {
  // Final cleanup
});
