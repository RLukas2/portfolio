import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    env: {
      NODE_ENV: 'test',
      IP_ADDRESS_SALT: 'test-salt',
      BLOB_TOKEN: 'test-blob-token',
    },
  },
});
