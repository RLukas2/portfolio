// biome-ignore lint/performance/noNamespaceImport: Sentry SDK requires namespace import
import * as Sentry from '@sentry/node';
import type { db as DB } from '@xbrk/db/client';
import { CreateSnippetSchema, snippet, UpdateSnippetSchema } from '@xbrk/db/schema';
import { desc, eq } from 'drizzle-orm';
import type { z } from 'zod/v4';

type DbClient = typeof DB;

/** Returns all snippets including drafts. For admin use only. */
export async function getAll(db: DbClient) {
  try {
    return await db.query.snippet.findMany({
      orderBy: desc(snippet.id),
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error('[snippet.getAll] Database error:', error);
    return [];
  }
}

/** Returns only published (non-draft) snippets. */
export async function getAllPublic(db: DbClient) {
  try {
    return await db.query.snippet.findMany({
      orderBy: desc(snippet.id),
      where: eq(snippet.isDraft, false),
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error('[snippet.getAllPublic] Database error:', error);
    return [];
  }
}

/** Returns a single snippet by ID. */
export async function getById(db: DbClient, input: { id: string }) {
  try {
    return await db.query.snippet.findFirst({
      where: eq(snippet.id, input.id),
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error('[snippet.getById] Database error:', error);
    return undefined;
  }
}

/**
 * Returns a single snippet by slug.
 * Draft snippets are only accessible to admins.
 * @throws {Error} If snippet not found or is a draft and requester is not admin.
 */
export async function getBySlug(db: DbClient, input: { slug: string }, session?: { user: { role: string } } | null) {
  try {
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
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === 'Snippet not found' || error.message === 'Snippet is not public')
    ) {
      throw error;
    }
    Sentry.captureException(error);
    console.error('[snippet.getBySlug] Database error:', error);
    throw new Error('Failed to fetch snippet');
  }
}

export async function create(db: DbClient, input: z.infer<typeof CreateSnippetSchema>) {
  try {
    const [created] = await db.insert(snippet).values(input).returning();
    return created;
  } catch (error) {
    Sentry.captureException(error);
    console.error('[snippet.create] Database error:', error);
    throw new Error('Failed to create snippet');
  }
}

export async function update(db: DbClient, input: z.infer<typeof UpdateSnippetSchema>) {
  try {
    const [updated] = await db.update(snippet).set(input).where(eq(snippet.id, input.id)).returning();
    return updated;
  } catch (error) {
    Sentry.captureException(error);
    console.error('[snippet.update] Database error:', error);
    throw new Error('Failed to update snippet');
  }
}

export async function remove(db: DbClient, id: string) {
  try {
    await db.delete(snippet).where(eq(snippet.id, id));
  } catch (error) {
    Sentry.captureException(error);
    console.error('[snippet.remove] Database error:', error);
    throw new Error('Failed to delete snippet');
  }
}
