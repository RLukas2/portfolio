// biome-ignore lint/performance/noNamespaceImport: Sentry SDK requires namespace import
import * as Sentry from '@sentry/node';
import type { db as DB } from '@xbrk/db/client';
import { CreateSnippetSchema, snippet, UpdateSnippetSchema } from '@xbrk/db/schema';
import { InternalServerError, NotFoundError } from '@xbrk/errors';
import { markdownToHastJson, RENDERING_VERSION } from '@xbrk/md/processor';
import { desc, eq, sql } from 'drizzle-orm';
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
    const query = db.query.snippet
      .findFirst({
        where: eq(snippet.id, sql.placeholder('id')),
      })
      .prepare('get_snippet_by_id');
    return await query.execute({ id: input.id });
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
    const query = db.query.snippet
      .findFirst({
        where: eq(snippet.slug, sql.placeholder('slug')),
      })
      .prepare('get_snippet_by_slug');
    const result = await query.execute({ slug: input.slug });

    if (!result) {
      throw new NotFoundError('Snippet not found');
    }

    if (result.isDraft && session?.user.role !== 'admin') {
      throw new NotFoundError('Snippet is not public');
    }

    return result;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    Sentry.captureException(error);
    console.error('[snippet.getBySlug] Database error:', error);
    throw new InternalServerError('Failed to fetch snippet');
  }
}

export async function create(db: DbClient, input: z.infer<typeof CreateSnippetSchema>) {
  try {
    const contentRendering = input.code ? await markdownToHastJson(input.code) : null;

    await db.insert(snippet).values({
      ...input,
      contentRendering,
      contentRenderingVersion: RENDERING_VERSION,
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error('[snippet.create] Database error:', error);
    throw new InternalServerError('Failed to create snippet');
  }
}

export async function update(db: DbClient, input: z.infer<typeof UpdateSnippetSchema>) {
  try {
    const { id, ...updateData } = input;
    const setData: Record<string, unknown> = { ...updateData };

    if (input.code !== undefined) {
      setData.contentRendering = input.code ? await markdownToHastJson(input.code) : null;
      setData.contentRenderingVersion = RENDERING_VERSION;
    }

    await db.update(snippet).set(setData).where(eq(snippet.id, id));
  } catch (error) {
    Sentry.captureException(error);
    console.error('[snippet.update] Database error:', error);
    throw new InternalServerError('Failed to update snippet');
  }
}

export async function remove(db: DbClient, id: string) {
  try {
    await db.delete(snippet).where(eq(snippet.id, id));
  } catch (error) {
    Sentry.captureException(error);
    console.error('[snippet.remove] Database error:', error);
    throw new InternalServerError('Failed to delete snippet');
  }
}
