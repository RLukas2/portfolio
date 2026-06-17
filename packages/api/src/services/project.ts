// biome-ignore lint/performance/noNamespaceImport: Sentry SDK requires namespace import
import * as Sentry from '@sentry/node';
import { CreateProjectSchema, UpdateProjectSchema } from '@xbrk/db/api-schemas';
import type { db as DB } from '@xbrk/db/client';
import { project } from '@xbrk/db/schema';
import { InternalServerError, NotFoundError } from '@xbrk/errors';
import { getTOCFromHast, markdownToHastJson, RENDERING_VERSION } from '@xbrk/md/processor';
import { desc, eq, sql } from 'drizzle-orm';
import type { z } from 'zod/v4';
import { handleImageUpdate, handleImageUpload } from '../lib/base-service';
import { deleteFile } from '../storage';

type DbClient = typeof DB;

/** Returns all projects including drafts. For admin use only. */
export async function getAll(db: DbClient) {
  try {
    return await db.query.project.findMany({
      orderBy: desc(project.id),
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error('[project.getAll] Database error:', error);
    return [];
  }
}

/** Returns only published projects, ordered by featured status. */
export async function getAllPublic(db: DbClient) {
  try {
    return await db.query.project.findMany({
      orderBy: desc(project.isFeatured),
      where: eq(project.isDraft, false),
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error('[project.getAllPublic] Database error:', error);
    return [];
  }
}

/**
 * Returns a single project by slug with a generated TOC from its markdown content.
 * Draft projects are only accessible to admins.
 * @throws {Error} If project not found or is a draft and requester is not admin.
 */
export async function getBySlug(db: DbClient, input: { slug: string }, session?: { user: { role: string } } | null) {
  try {
    const query = db.query.project
      .findFirst({
        where: eq(project.slug, sql.placeholder('slug')),
      })
      .prepare('get_project_by_slug');
    const result = await query.execute({ slug: input.slug });

    if (!result) {
      throw new NotFoundError('Project not found');
    }

    if (result.isDraft && session?.user.role !== 'admin') {
      throw new NotFoundError('Project is not public');
    }

    const toc = getTOCFromHast(result.contentRendering);

    return { ...result, toc };
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    Sentry.captureException(error);
    console.error('[project.getBySlug] Database error:', error);
    throw new InternalServerError('Failed to fetch project');
  }
}

/**
 * Returns a single project by ID.
 * @throws {Error} If project not found.
 */
export async function getById(db: DbClient, input: { id: string }) {
  try {
    const query = db.query.project
      .findFirst({
        where: eq(project.id, sql.placeholder('id')),
      })
      .prepare('get_project_by_id');
    const result = await query.execute({ id: input.id });

    if (!result) {
      throw new NotFoundError('Project not found');
    }

    return result;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    Sentry.captureException(error);
    console.error('[project.getById] Database error:', error);
    throw new InternalServerError('Failed to fetch project');
  }
}

/**
 * Creates a new project. If a thumbnail is provided, it is uploaded to storage
 * and saved as `imageUrl`.
 */
export async function create(db: DbClient, input: z.infer<typeof CreateProjectSchema>) {
  try {
    const { thumbnail, ...projectData } = input;

    const imageUrl = await handleImageUpload('projects', thumbnail, input.slug, 'project');
    if (imageUrl) {
      projectData.imageUrl = imageUrl;
    }

    const contentRendering = projectData.content ? await markdownToHastJson(projectData.content) : null;

    return db.insert(project).values({
      ...projectData,
      contentRendering,
      contentRenderingVersion: RENDERING_VERSION,
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error('[project.create] Database error:', error);
    throw new InternalServerError('Failed to create project');
  }
}

/**
 * Updates a project. If a new thumbnail is provided, uploads it and deletes the old one.
 * Old image is only deleted after the new upload succeeds.
 */
export async function update(db: DbClient, input: z.infer<typeof UpdateProjectSchema>) {
  try {
    const { thumbnail, id, ...projectData } = input;

    await db.transaction(async (tx) => {
      if (thumbnail) {
        const existingProject = await tx.query.project.findFirst({
          where: eq(project.id, id),
        });

        const imageUrl = await handleImageUpdate(
          'projects',
          thumbnail,
          input.slug ?? id,
          existingProject?.imageUrl,
          'project',
        );

        if (imageUrl) {
          projectData.imageUrl = imageUrl;
        }
      }

      const setData: Record<string, unknown> = { ...projectData };

      if (projectData.content !== undefined) {
        setData.contentRendering = projectData.content ? await markdownToHastJson(projectData.content) : null;
        setData.contentRenderingVersion = RENDERING_VERSION;
      }

      await tx.update(project).set(setData).where(eq(project.id, id));
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error('[project.update] Database error:', error);
    throw new InternalServerError('Failed to update project');
  }
}

/**
 * Deletes a project and its associated image from storage if present.
 * @throws {Error} If project not found.
 */
export async function remove(db: DbClient, id: string) {
  try {
    await db.transaction(async (tx) => {
      const projectToDelete = await tx.query.project.findFirst({
        where: eq(project.id, id),
      });

      if (!projectToDelete) {
        throw new NotFoundError('Project not found');
      }

      await tx.delete(project).where(eq(project.id, id));

      if (projectToDelete.imageUrl) {
        try {
          await deleteFile(projectToDelete.imageUrl);
        } catch (error) {
          Sentry.captureException(error);
          console.error('[project.remove] Image deletion failed:', error);
        }
      }
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    Sentry.captureException(error);
    console.error('[project.remove] Database error:', error);
    throw new InternalServerError('Failed to delete project');
  }
}
