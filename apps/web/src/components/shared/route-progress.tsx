import { useRouter } from '@tanstack/react-router';
import { useEffect } from 'react';
import NProgress from '@/lib/nprogress';

/**
 * RouteProgress Component
 *
 * Displays a loading progress bar at the top of the page during route transitions.
 * Automatically starts when navigation begins and completes when the route loads.
 */
export function RouteProgress() {
  const router = useRouter();

  useEffect(() => {
    // Start progress bar when navigation begins
    const unsubscribeStart = router.subscribe('onBeforeLoad', () => {
      NProgress.start();
    });

    // Complete progress bar when navigation finishes
    const unsubscribeEnd = router.subscribe('onLoad', () => {
      NProgress.done();
    });

    // Cleanup subscriptions
    return () => {
      unsubscribeStart();
      unsubscribeEnd();
    };
  }, [router]);

  return null; // This component doesn't render anything
}
