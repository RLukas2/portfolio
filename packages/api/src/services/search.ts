// biome-ignore lint/performance/noNamespaceImport: Sentry SDK requires namespace import
import * as Sentry from '@sentry/node';
import type { db as DB } from '@xbrk/db/client';
import { articles, project, snippet } from '@xbrk/db/schema';
import { ValidationError } from '@xbrk/errors';
import { and, eq, ilike, or } from 'drizzle-orm';
import { escapeSearchTerm, validateSearchQuery } from '../lib/validation';

type DbClient = typeof DB;

interface SearchResult {
  description: string | null;
  id: string;
  slug: string;
  title: string;
}

interface SearchResults {
  articles: SearchResult[];
  projects: SearchResult[];
  snippets: SearchResult[];
}

/**
 * Searches across articles, projects, and snippets using case-insensitive ILIKE.
 * Only published (non-draft) records are included. Returns up to 5 results per entity type.
 * Special SQL characters (`%`, `_`, `\`) in the query are escaped before matching.
 * @throws {Error} If query validation fails
 */
export async function query(db: DbClient, input: { query: string }): Promise<SearchResults> {
  try {
    // Validate search query
    const validation = validateSearchQuery(input.query);
    if (!validation.valid) {
      throw new ValidationError(validation.error ?? 'Invalid search query');
    }

    const searchTerm = `%${escapeSearchTerm(input.query)}%`;

    const [articlesResult, projectsResult, snippetsResult] = await Promise.all([
      db.query.articles.findMany({
        where: and(
          eq(articles.isDraft, false),
          or(ilike(articles.title, searchTerm), ilike(articles.description, searchTerm)),
        ),
        columns: {
          id: true,
          title: true,
          slug: true,
          description: true,
        },
        limit: 5,
      }),
      db.query.project.findMany({
        where: and(
          eq(project.isDraft, false),
          or(ilike(project.title, searchTerm), ilike(project.description, searchTerm)),
        ),
        columns: {
          id: true,
          title: true,
          slug: true,
          description: true,
        },
        limit: 5,
      }),
      db.query.snippet.findMany({
        where: and(
          eq(snippet.isDraft, false),
          or(ilike(snippet.title, searchTerm), ilike(snippet.description, searchTerm)),
        ),
        columns: {
          id: true,
          title: true,
          slug: true,
          description: true,
        },
        limit: 5,
      }),
    ]);

    return {
      articles: articlesResult,
      projects: projectsResult,
      snippets: snippetsResult,
    };
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    Sentry.captureException(error);
    console.error('[search.query] Database error:', error);
    return {
      articles: [],
      projects: [],
      snippets: [],
    };
  }
}
