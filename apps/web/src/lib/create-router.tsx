import { QueryCache, QueryClient } from '@tanstack/react-query';
import type { AnyRoute } from '@tanstack/react-router';
import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';
import { DefaultCatchBoundary } from '@xbrk/ui/default-catch-boundary';
import { NotFound } from '@xbrk/ui/not-found';

interface CreateRouterOptions<TRouteTree extends AnyRoute> {
  debug?: boolean;
  routeTree: TRouteTree;
}

export function createRouter<TRouteTree extends AnyRoute>({
  routeTree,
  debug = false,
}: CreateRouterOptions<TRouteTree>) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60,
      },
    },
    queryCache: new QueryCache(),
  });

  const router = createTanStackRouter({
    context: { queryClient, user: null },
    routeTree,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: (props) => <DefaultCatchBoundary {...props} debug={debug} />,
    defaultNotFoundComponent: () => <NotFound />,
    scrollRestoration: true,
    defaultHashScrollIntoView: { behavior: 'smooth' },
    defaultStructuralSharing: true,
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
    handleRedirects: true,
    wrapQueryClient: true,
  });

  return router;
}
