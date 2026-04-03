// biome-ignore lint/performance/noNamespaceImport: Sentry SDK requires namespace import
import * as Sentry from '@sentry/node';
import type { db as DB } from '@xbrk/db/client';
import { CreateSnippetSchema, snippet, UpdateSnippetSchema } from '@xbrk/db/schema';
import { desc, eq } from 'drizzle-orm';
import type { z } from 'zod/v4';

type DbClient = typeof DB;

/** Returns all snippets including drafts. For admin use only. */
export function getAll(db: DbClient) {
  return db.query.snippet.findMany({
    orderBy: desc(snippet.id),
  });
}

/** Returns only published (non-draft) snippets. */
export function getAllPublic(db: DbClient) {
  return db.query.snippet
    .findMany({
      orderBy: desc(snippet.id),
      where: eq(snippet.isDraft, false),
    })
    .catch((error) => {
      Sentry.captureException(error);
      return [];
    });
}

/** Returns a single snippet by ID. Returns `undefined` if not found. */
export function getById(db: DbClient, input: { id: string }) {
  return db.query.snippet.findFirst({
    where: eq(snippet.id, input.id),
  });
}

/**
 * Returns a single snippet by slug.
 * Draft snippets are only accessible to admins.
 * @throws {Error} If snippet not found or is a draft and requester is not admin.
 */
export async function getBySlug(db: DbClient, input: { slug: string }, session?: { user: { role: string } } | null) {
  const result = await db.query.snippet.findFirst({
    where: eq(snippet.slug, input.slug),
  });

  if (!result) {
    throw new Error('Snippet not found');
  }

  if (result.isDraft && session?.user.role !== 'admin') {
    throw new Error('Snippet is not public');
  }

  return result;
}

export function create(db: DbClient, input: z.infer<typeof CreateSnippetSchema>) {
  return db.insert(snippet).values(input);
}

export function update(db: DbClient, input: z.infer<typeof UpdateSnippetSchema>) {
  return db.update(snippet).set(input).where(eq(snippet.id, input.id));
}

export function remove(db: DbClient, id: string) {
  return db.delete(snippet).where(eq(snippet.id, id));
}
