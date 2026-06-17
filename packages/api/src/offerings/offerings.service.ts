import { CreateServiceSchema, UpdateServiceSchema } from '@xbrk/db/api-schemas';
import type { db as DB } from '@xbrk/db/client';
import { service } from '@xbrk/db/schema';
import { HttpError, InternalServerError, NotFoundError } from '@xbrk/errors';
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
    return await db.query.service.findMany({
      orderBy: desc(service.id),
    });
  } catch (error) {
    reportError('offerings.getAll', error);
    return [];
  }
}

export async function getAllPublic(db: DbClient) {
  try {
    return await db.query.service.findMany({
      where: eq(service.isDraft, false),
    });
  } catch (error) {
    reportError('offerings.getAllPublic', error);
    return [];
  }
}

export async function getBySlug(db: DbClient, input: { slug: string }, session?: { user: { role: string } } | null) {
  try {
    const query = db.query.service
      .findFirst({
        where: eq(service.slug, sql.placeholder('slug')),
      })
      .prepare('get_service_by_slug');
    const serviceResult = await query.execute({ slug: input.slug });

    assertPublishedOrAdmin(serviceResult, 'Service', session);

    return serviceResult;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    reportError('offerings.getBySlug', error);
    throw new InternalServerError('Failed to fetch service');
  }
}

export async function getById(db: DbClient, input: { id: string }) {
  try {
    const query = db.query.service
      .findFirst({
        where: eq(service.id, sql.placeholder('id')),
      })
      .prepare('get_service_by_id');
    return await query.execute({ id: input.id });
  } catch (error) {
    reportError('offerings.getById', error);
    return undefined;
  }
}

export async function create(db: DbClient, input: z.infer<typeof CreateServiceSchema>) {
  const { thumbnail, ...serviceData } = input;

  let uploadedUrl: string | undefined;
  const imageUrl = await handleImageUpload('services', thumbnail, input.slug, 'service');
  if (imageUrl) {
    uploadedUrl = imageUrl;
    serviceData.imageUrl = imageUrl;
  }

  const { contentRendering, contentRenderingVersion } = await buildContentRendering(serviceData.content);

  try {
    return await db.insert(service).values({
      ...serviceData,
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
    reportError('offerings.create', error);
    throw new InternalServerError('Failed to create service');
  }
}

export async function update(db: DbClient, input: z.infer<typeof UpdateServiceSchema>) {
  try {
    const { thumbnail, id, ...serviceData } = input;

    const existingService = await db.query.service.findFirst({
      where: eq(service.id, id),
    });
    if (!existingService) {
      throw new NotFoundError('Service not found');
    }

    let oldImageUrl: string | null | undefined;
    if (thumbnail) {
      oldImageUrl = existingService.imageUrl;

      const imageUrl = await handleImageUpload('services', thumbnail, input.slug ?? id, 'service');

      if (imageUrl) {
        serviceData.imageUrl = imageUrl;
      }
    }

    const setData: Record<string, unknown> = { ...serviceData };

    if (serviceData.content !== undefined) {
      const { contentRendering, contentRenderingVersion: version } = await buildContentRendering(serviceData.content);
      setData.contentRendering = contentRendering;
      setData.contentRenderingVersion = version;
    }

    await db.update(service).set(setData).where(eq(service.id, id));

    if (oldImageUrl) {
      try {
        await deleteFile(oldImageUrl);
      } catch (error) {
        reportError('offerings.update', error);
      }
    }
  } catch (error) {
    if (error instanceof HttpError || error instanceof NotFoundError) {
      throw error;
    }
    reportError('offerings.update', error);
    throw new InternalServerError('Failed to update service');
  }
}

export async function remove(db: DbClient, id: string) {
  try {
    const serviceToDelete = await db.query.service.findFirst({
      where: eq(service.id, id),
    });

    if (!serviceToDelete) {
      throw new NotFoundError('Service not found');
    }

    await db.delete(service).where(eq(service.id, id));

    if (serviceToDelete.imageUrl) {
      try {
        await deleteFile(serviceToDelete.imageUrl);
      } catch (error) {
        reportError('offerings.remove', error);
      }
    }
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    reportError('offerings.remove', error);
    throw new InternalServerError('Failed to delete service');
  }
}
