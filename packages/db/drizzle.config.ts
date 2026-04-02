import type { Config } from 'drizzle-kit';
import { env } from './env';

const config: Config = {
  out: './drizzle',
  schema: './src/schema/index.ts',
  breakpoints: true,
  verbose: true,
  strict: true,
  dialect: 'postgresql',
  casing: 'snake_case',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
};

export default config;
