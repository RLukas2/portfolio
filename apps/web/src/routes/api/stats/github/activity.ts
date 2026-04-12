import { createFileRoute } from '@tanstack/react-router';
import { createSuccessResponse, handleApiError } from '@xbrk/api';
import { ServiceUnavailableError } from '@xbrk/errors';
import { getGithubActivities } from '@/lib/integrations/github';

/**
 * GitHub Activity API Route
 *
 * Fetches GitHub contribution activity data for displaying a contribution calendar.
 * Returns daily contribution counts that can be visualized in a heatmap.
 *
 * This endpoint is used to show the GitHub contribution graph on the portfolio.
 *
 * @example
 * GET /api/stats/github/activity
 * Response:
 * {
 *   "data": {
 *     "contributions": [
 *       { "date": "2024-01-01", "count": 5 },
 *       { "date": "2024-01-02", "count": 3 }
 *     ]
 *   }
 * }
 *
 * @returns JSON response with contribution activity data
 */
export const Route = createFileRoute('/api/stats/github/activity')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const contributions = await getGithubActivities();
          return createSuccessResponse({ contributions });
        } catch (error) {
          console.error('[GitHub Activity API] Error fetching activity:', error);
          return handleApiError(new ServiceUnavailableError('GitHub activity is temporarily unavailable'), request);
        }
      },
    },
  },
});
