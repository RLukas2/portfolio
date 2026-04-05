import { createFileRoute } from '@tanstack/react-router';
import { getTOC } from '@xbrk/utils';

/**
 * Changelog API Route
 *
 * Provides changelog content and table of contents for the site.
 * Content is cached for 1 hour to improve performance.
 *
 * @returns JSON response with changelog content and table of contents
 * @example
 * GET /api/changelog
 * Response:
 * {
 *   "content": "# Changelog\n\n## v1.0.0...",
 *   "toc": [{ "id": "v1-0-0", "text": "v1.0.0", "level": 2 }]
 * }
 */
export const Route = createFileRoute('/api/changelog/')({
  server: {
    handlers: {
      GET: () => {
        try {
          const content = 'TODO: Implement changelog content' as string;
          const toc = getTOC(content ?? '');

          return new Response(JSON.stringify({ content, toc }), {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'public, max-age=3600, s-maxage=3600',
            },
          });
        } catch (error) {
          return new Response(
            JSON.stringify({
              error: 'Failed to load changelog',
              message: error instanceof Error ? error.message : 'Unknown error',
            }),
            {
              status: 500,
              headers: {
                'Content-Type': 'application/json',
              },
            },
          );
        }
      },
    },
  },
});
