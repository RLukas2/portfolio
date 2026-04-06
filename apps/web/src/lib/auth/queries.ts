import { queryOptions } from '@tanstack/react-query';
import { $getUser } from './functions';

/**
 * React Query options for fetching the authenticated user.
 *
 * @returns Query options configured for user authentication state
 */
export const authQueryOptions = () =>
  queryOptions({
    queryKey: ['user'],
    queryFn: ({ signal }) => $getUser({ signal }),
  });

/**
 * Type representing the result of the user query.
 */
export type AuthQueryResult = Awaited<ReturnType<typeof $getUser>>;
