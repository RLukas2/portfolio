// biome-ignore lint/performance/noNamespaceImport: Sentry SDK requires namespace import
import * as Sentry from '@sentry/node';
import type { db as DB } from '@xbrk/db/client';
import { CreateProjectSchema, project, UpdateProjectSchema } from '@xbrk/db/schema';
import { getTOC } from '@xbrk/utils';
import { desc, eq } from 'drizzle-orm';
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
    const result = await db.query.project.findFirst({
      where: eq(project.slug, input.slug),
    });

    if (!result) {
      throw new Error('Project not found');
    }

    if (result.isDraft && session?.user.role !== 'admin') {
      throw new Error('Project is not public');
    }

    const toc = getTOC(result.content ?? '');

    return { ...result, toc };
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === 'Project not found' || error.message === 'Project is not public')
    ) {
      throw error;
    }
    Sentry.captureException(error);
    console.error('[project.getBySlug] Database error:', error);
    throw new Error('Failed to fetch project');
  }
}

/**
 * Returns a single project by ID.
 * @throws {Error} If project not found.
 */
export async function getById(db: DbClient, input: { id: string }) {
  try {
    const result = await db.query.project.findFirst({
      where: eq(project.id, input.id),
    });

    if (!result) {
      throw new Error('Project not found');
    }

    return result;
  } catch (error) {
    if (error instanceof Error && error.message === 'Project not found') {
      throw error;
    }
    Sentry.captureException(error);
    console.error('[project.getById] Database error:', error);
    throw new Error('Failed to fetch project');
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

    const [created] = await db.insert(project).values(projectData).returning();
    return created;
  } catch (error) {
    Sentry.captureException(error);
    console.error('[project.create] Database error:', error);
    throw new Error('Failed to create project');
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

      await tx.update(project).set(projectData).where(eq(project.id, id));
    });

    return db.query.project.findFirst({ where: eq(project.id, id) }).then((result) => {
      if (!result) {
        throw new Error('Project not found');
      }
      return result;
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error('[project.update] Database error:', error);
    throw new Error('Failed to update project');
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
        throw new Error('Project not found');
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
    if (error instanceof Error && error.message === 'Project not found') {
      throw error;
    }
    Sentry.captureException(error);
    console.error('[project.remove] Database error:', error);
    throw new Error('Failed to delete project');
  }
}
