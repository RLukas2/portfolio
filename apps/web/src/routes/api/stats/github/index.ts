import { createFileRoute } from '@tanstack/react-router';
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
 *   "user": { "login": "rlukas2", "name": "Tuan Ngo-Hoang", ... },
 *   "repos": [{ "name": "repo1", "stars": 10, ... }],
 *   "starsCount": 42
 * }
 *
 * @returns JSON response with GitHub statistics
 */
export const Route = createFileRoute('/api/stats/github/')({
  server: {
    handlers: {
      GET: async () => {
        try {
          const { user, repos, starsCount } = (await getGithubStats()) || {};
          return Response.json({ user, repos, starsCount });
        } catch (error) {
          console.error('[GitHub Stats API] Error fetching stats:', error);

          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          return Response.json(
            {
              error: 'Failed to fetch GitHub statistics',
              details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
            },
            { status: 500 },
          );
        }
      },
    },
  },
});
