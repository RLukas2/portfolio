import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { env } from '../env';

// biome-ignore lint/performance/noNamespaceImport: we want to import all of the schema for the client
import * as schema from './schema';

const driver = neon(env.DATABASE_URL);

export const db = drizzle({
  client: driver,
  schema,
  casing: 'snake_case',
});
