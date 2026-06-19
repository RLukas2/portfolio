import { useQuery } from '@tanstack/react-query';
import { authQueryOptions } from '@/lib/auth/queries';

export function useCurrentUser() {
  const { data: user, isLoading } = useQuery(authQueryOptions());
  return {
    user: user ?? null,
    isAuthenticated: Boolean(user),
    isLoading,
  };
}
