import { articles, project, snippet } from '@xbrk/db/schema';
import { ValidationError } from '@xbrk/errors';
import { and, eq, ilike, or } from 'drizzle-orm';
import type { DbClient } from '../shared/db';
import { reportError } from '../shared/errors';
import { escapeSearchTerm, validateSearchQuery } from '../shared/validation';

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

export async function query(db: DbClient, input: { query: string }): Promise<SearchResults> {
  try {
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
    reportError('search.query', error);
    return {
      articles: [],
      projects: [],
      snippets: [],
    };
  }
}
