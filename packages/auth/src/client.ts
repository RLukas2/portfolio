import { createAuthClient } from 'better-auth/client';
import { adminClient } from 'better-auth/client/plugins';

export function createClient(baseURL: string) {
  return createAuthClient({
    baseURL,
    plugins: [adminClient()],
  });
}

export type AuthClient = ReturnType<typeof createClient>;
