import type { db as DB } from '@xbrk/db/client';
import { articles, project, snippet } from '@xbrk/db/schema';
import { and, eq, ilike, or } from 'drizzle-orm';

type DbClient = typeof DB;

function escapeSearchTerm(term: string): string {
  return term.replace(/[%_\\]/g, (char) => `\\${char}`);
}

/**
 * Searches across articles, projects, and snippets using case-insensitive ILIKE.
 * Only published (non-draft) records are included. Returns up to 5 results per entity type.
 * Special SQL characters (`%`, `_`, `\`) in the query are escaped before matching.
 */
export async function query(db: DbClient, input: { query: string }) {
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
}
