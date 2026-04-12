import { createClientOnlyFn } from '@tanstack/react-start';
import { createRouter } from '@xbrk/shared/create-router';
import { routeTree } from './routeTree.gen';

// Create a client-only function for Sentry initialization
const initSentry = createClientOnlyFn(async () => {
  const { initClientSentry } = await import('./instrument.client');
  return initClientSentry;
});

export function getRouter() {
  const router = createRouter<typeof routeTree>({
    routeTree,
    debug: import.meta.env.DEV,
  });

  // Initialize Sentry on client-side only
  if (!router.isServer) {
    initSentry()?.then((init) => {
      if (init) {
        init(router);
      }
    });
  }

  return router;
}
