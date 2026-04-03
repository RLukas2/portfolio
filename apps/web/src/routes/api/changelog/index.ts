import { createFileRoute } from '@tanstack/react-router';
import { getTOC } from '@xbrk/utils';

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
