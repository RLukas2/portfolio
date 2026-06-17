import { CreateSnippetSchema, UpdateSnippetSchema } from '@xbrk/db/api-schemas';
import type { db as DB } from '@xbrk/db/client';
import { snippet } from '@xbrk/db/schema';
import { InternalServerError, NotFoundError } from '@xbrk/errors';
import { desc, eq, sql } from 'drizzle-orm';
import type { z } from 'zod/v4';
import { assertPublishedOrAdmin } from '../shared/draft-access';
import { reportError } from '../shared/errors';
import { buildContentRendering } from '../shared/markdown-rendering';

type DbClient = typeof DB;

export async function getAll(db: DbClient) {
  try {
    return await db.query.snippet.findMany({
      orderBy: desc(snippet.id),
    });
  } catch (error) {
    reportError('snippets.getAll', error);
    return [];
  }
}

export async function getAllPublic(db: DbClient) {
  try {
    return await db.query.snippet.findMany({
      orderBy: desc(snippet.id),
      where: eq(snippet.isDraft, false),
    });
  } catch (error) {
    reportError('snippets.getAllPublic', error);
    return [];
  }
}

export async function getById(db: DbClient, input: { id: string }) {
  try {
    const query = db.query.snippet
      .findFirst({
        where: eq(snippet.id, sql.placeholder('id')),
      })
      .prepare('get_snippet_by_id');
    return await query.execute({ id: input.id });
  } catch (error) {
    reportError('snippets.getById', error);
    return undefined;
  }
}

export async function getBySlug(db: DbClient, input: { slug: string }, session?: { user: { role: string } } | null) {
  try {
    const query = db.query.snippet
      .findFirst({
        where: eq(snippet.slug, sql.placeholder('slug')),
      })
      .prepare('get_snippet_by_slug');
    const result = await query.execute({ slug: input.slug });

    assertPublishedOrAdmin(result, 'Snippet', session);

    return result;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    reportError('snippets.getBySlug', error);
    throw new InternalServerError('Failed to fetch snippet');
  }
}

export async function create(db: DbClient, input: z.infer<typeof CreateSnippetSchema>) {
  try {
    const { contentRendering, contentRenderingVersion } = await buildContentRendering(input.code);

    await db.insert(snippet).values({
      ...input,
      contentRendering,
      contentRenderingVersion,
    });
  } catch (error) {
    reportError('snippets.create', error);
    throw new InternalServerError('Failed to create snippet');
  }
}

export async function update(db: DbClient, input: z.infer<typeof UpdateSnippetSchema>) {
  try {
    const { id, ...updateData } = input;

    const existing = await db.query.snippet.findFirst({
      where: eq(snippet.id, id),
    });
    if (!existing) {
      throw new NotFoundError('Snippet not found');
    }

    const setData: Record<string, unknown> = { ...updateData };

    if (input.code !== undefined) {
      const { contentRendering, contentRenderingVersion: version } = await buildContentRendering(input.code);
      setData.contentRendering = contentRendering;
      setData.contentRenderingVersion = version;
    }

    await db.update(snippet).set(setData).where(eq(snippet.id, id));
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    reportError('snippets.update', error);
    throw new InternalServerError('Failed to update snippet');
  }
}

export async function remove(db: DbClient, id: string) {
  try {
    const existing = await db.query.snippet.findFirst({
      where: eq(snippet.id, id),
    });

    if (!existing) {
      throw new NotFoundError('Snippet not found');
    }

    await db.delete(snippet).where(eq(snippet.id, id));
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    reportError('snippets.remove', error);
    throw new InternalServerError('Failed to delete snippet');
  }
}
