import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createFileRoute } from '@tanstack/react-router';
import { createSuccessResponse, handleApiError } from '@xbrk/api';
import { NotFoundError } from '@xbrk/errors';
import { processMarkdownToHtml } from '@xbrk/md';
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
 *   "data": {
 *     "content": "# Changelog\n\n## v1.0.0...",
 *     "toc": [{ "id": "v1-0-0", "text": "v1.0.0", "level": 2 }]
 *   }
 * }
 */
export const Route = createFileRoute('/api/changelog/')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const changelogPath = join(process.cwd(), 'changelog.md');
          const content = readFileSync(changelogPath, 'utf-8');
          const [toc, renderedContent] = await Promise.all([
            Promise.resolve(getTOC(content ?? '')),
            processMarkdownToHtml(content),
          ]);

          return createSuccessResponse({ renderedContent, toc }, undefined, 200, {
            'Cache-Control': 'public, max-age=3600, s-maxage=3600',
          });
        } catch (error) {
          if (error instanceof Error && 'code' in error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
            return handleApiError(new NotFoundError('Changelog file'), request);
          }
          return handleApiError(error, request);
        }
      },
    },
  },
});
