import { CreateProjectSchema, UpdateProjectSchema } from '@xbrk/db/api-schemas';
import type { db as DB } from '@xbrk/db/client';
import { project } from '@xbrk/db/schema';
import { HttpError, InternalServerError, NotFoundError } from '@xbrk/errors';
import { getTOCFromHast } from '@xbrk/md/processor';
import { desc, eq, sql } from 'drizzle-orm';
import type { z } from 'zod/v4';
import { assertPublishedOrAdmin } from '../shared/draft-access';
import { reportError } from '../shared/errors';
import { handleImageUpload } from '../shared/image-lifecycle';
import { buildContentRendering } from '../shared/markdown-rendering';
import { deleteFile } from '../storage/blob-storage';

type DbClient = typeof DB;

export async function getAll(db: DbClient) {
  try {
    return await db.query.project.findMany({
      orderBy: desc(project.id),
    });
  } catch (error) {
    reportError('projects.getAll', error);
    return [];
  }
}

export async function getAllPublic(db: DbClient) {
  try {
    return await db.query.project.findMany({
      orderBy: desc(project.isFeatured),
      where: eq(project.isDraft, false),
    });
  } catch (error) {
    reportError('projects.getAllPublic', error);
    return [];
  }
}

export async function getBySlug(db: DbClient, input: { slug: string }, session?: { user: { role: string } } | null) {
  try {
    const query = db.query.project
      .findFirst({
        where: eq(project.slug, sql.placeholder('slug')),
      })
      .prepare('get_project_by_slug');
    const result = await query.execute({ slug: input.slug });

    assertPublishedOrAdmin(result, 'Project', session);

    const toc = getTOCFromHast(result.contentRendering);

    return { ...result, toc };
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    reportError('projects.getBySlug', error);
    throw new InternalServerError('Failed to fetch project');
  }
}

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
    reportError('projects.getById', error);
    throw new InternalServerError('Failed to fetch project');
  }
}

export async function create(db: DbClient, input: z.infer<typeof CreateProjectSchema>) {
  const { thumbnail, ...projectData } = input;

  let uploadedUrl: string | undefined;
  const imageUrl = await handleImageUpload('projects', thumbnail, input.slug, 'project');
  if (imageUrl) {
    uploadedUrl = imageUrl;
    projectData.imageUrl = imageUrl;
  }

  const { contentRendering, contentRenderingVersion } = await buildContentRendering(projectData.content);

  try {
    return await db.insert(project).values({
      ...projectData,
      contentRendering,
      contentRenderingVersion,
    });
  } catch (error) {
    if (uploadedUrl) {
      try {
        await deleteFile(uploadedUrl);
      } catch {
        // cleanup orphan blob on insert failure
      }
    }
    reportError('projects.create', error);
    throw new InternalServerError('Failed to create project');
  }
}

export async function update(db: DbClient, input: z.infer<typeof UpdateProjectSchema>) {
  try {
    const { thumbnail, id, ...projectData } = input;

    const existingProject = await db.query.project.findFirst({
      where: eq(project.id, id),
    });
    if (!existingProject) {
      throw new NotFoundError('Project not found');
    }

    let oldImageUrl: string | null | undefined;
    if (thumbnail) {
      oldImageUrl = existingProject.imageUrl;

      const imageUrl = await handleImageUpload('projects', thumbnail, input.slug ?? id, 'project');

      if (imageUrl) {
        projectData.imageUrl = imageUrl;
      }
    }

    const setData: Record<string, unknown> = { ...projectData };

    if (projectData.content !== undefined) {
      const { contentRendering, contentRenderingVersion: version } = await buildContentRendering(projectData.content);
      setData.contentRendering = contentRendering;
      setData.contentRenderingVersion = version;
    }

    await db.update(project).set(setData).where(eq(project.id, id));

    if (oldImageUrl) {
      try {
        await deleteFile(oldImageUrl);
      } catch (error) {
        reportError('projects.update', error);
      }
    }
  } catch (error) {
    if (error instanceof HttpError || error instanceof NotFoundError) {
      throw error;
    }
    reportError('projects.update', error);
    throw new InternalServerError('Failed to update project');
  }
}

export async function remove(db: DbClient, id: string) {
  try {
    const projectToDelete = await db.query.project.findFirst({
      where: eq(project.id, id),
    });

    if (!projectToDelete) {
      throw new NotFoundError('Project not found');
    }

    await db.delete(project).where(eq(project.id, id));

    if (projectToDelete.imageUrl) {
      try {
        await deleteFile(projectToDelete.imageUrl);
      } catch (error) {
        reportError('projects.remove', error);
      }
    }
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    reportError('projects.remove', error);
    throw new InternalServerError('Failed to delete project');
  }
}
