import { createFileRoute } from '@tanstack/react-router';
import { createSuccessResponse, handleApiError } from '@xbrk/api';
import { ServiceUnavailableError } from '@xbrk/errors';
import { getGithubStats } from '@/lib/integrations/github';

/**
 * GitHub Stats API Route
 *
 * Fetches GitHub statistics including user profile, repositories, and total stars.
 * This data is used to display GitHub metrics on the portfolio site.
 *
 * Data includes:
 * - User profile information (name, bio, followers, etc.)
 * - Repository list with metadata
 * - Total stars across all repositories
 *
 * @example
 * GET /api/stats/github
 * Response:
 * {
 *   "data": {
 *     "user": { "login": "rlukas2", "name": "Tuan Ngo-Hoang", ... },
 *     "repos": [{ "name": "repo1", "stars": 10, ... }],
 *     "starsCount": 42
 *   }
 * }
 *
 * @returns JSON response with GitHub statistics
 */
export const Route = createFileRoute('/api/stats/github/')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const { user, repos, starsCount } = (await getGithubStats()) || {};
          return createSuccessResponse({ user, repos, starsCount });
        } catch (error) {
          console.error('[GitHub Stats API] Error fetching stats:', error);
          return handleApiError(new ServiceUnavailableError('GitHub statistics are temporarily unavailable'), request);
        }
      },
    },
  },
});
