import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { queryKeys } from '@/lib/query-keys';
import { $viewArticle } from '@/lib/server';

export function useTrackView(slug: string) {
  const queryClient = useQueryClient();
  const hasViewedRef = useRef(false);

  const viewMutation = useMutation({
    mutationFn: (data: { slug: string }) => $viewArticle({ data }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.blog.detail(slug) });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: view once per mount
  useEffect(() => {
    if (!slug) {
      return;
    }
    if (hasViewedRef.current) {
      return;
    }
    hasViewedRef.current = true;

    const sessionKey = `viewed:${slug}`;
    if (sessionStorage.getItem(sessionKey)) {
      return;
    }
    sessionStorage.setItem(sessionKey, '1');

    viewMutation.mutate({ slug });
  }, [slug]);
}
