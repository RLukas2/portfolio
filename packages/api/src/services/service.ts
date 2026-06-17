// biome-ignore lint/performance/noNamespaceImport: Sentry SDK requires namespace import
import * as Sentry from '@sentry/node';
import { CreateServiceSchema, UpdateServiceSchema } from '@xbrk/db/api-schemas';
import type { db as DB } from '@xbrk/db/client';
import { service } from '@xbrk/db/schema';
import { InternalServerError, NotFoundError } from '@xbrk/errors';
import { markdownToHastJson, RENDERING_VERSION } from '@xbrk/md/processor';
import { desc, eq, sql } from 'drizzle-orm';
import type { z } from 'zod/v4';
import { handleImageUpdate, handleImageUpload } from '../lib/base-service';
import { deleteFile } from '../storage';

type DbClient = typeof DB;

/** Returns all services including drafts. For admin use only. */
export async function getAll(db: DbClient) {
  try {
    return await db.query.service.findMany({
      orderBy: desc(service.id),
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error('[service.getAll] Database error:', error);
    return [];
  }
}

/** Returns only published (non-draft) services. */
export async function getAllPublic(db: DbClient) {
  try {
    return await db.query.service.findMany({
      where: eq(service.isDraft, false),
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error('[service.getAllPublic] Database error:', error);
    return [];
  }
}

/**
 * Returns a single service by slug.
 * Draft services are only accessible to admins.
 * @throws {Error} If service not found or is a draft and requester is not admin.
 */
export async function getBySlug(db: DbClient, input: { slug: string }, session?: { user: { role: string } } | null) {
  try {
    const query = db.query.service
      .findFirst({
        where: eq(service.slug, sql.placeholder('slug')),
      })
      .prepare('get_service_by_slug');
    const serviceResult = await query.execute({ slug: input.slug });

    if (!serviceResult) {
      throw new NotFoundError('Service not found');
    }

    // if service is draft, throw an error unless user is admin
    if (serviceResult.isDraft && session?.user.role !== 'admin') {
      throw new NotFoundError('Service is not public');
    }

    return serviceResult;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    Sentry.captureException(error);
    console.error('[service.getBySlug] Database error:', error);
    throw new InternalServerError('Failed to fetch service');
  }
}

/** Returns a single service by ID. */
export async function getById(db: DbClient, input: { id: string }) {
  try {
    const query = db.query.service
      .findFirst({
        where: eq(service.id, sql.placeholder('id')),
      })
      .prepare('get_service_by_id');
    return await query.execute({ id: input.id });
  } catch (error) {
    Sentry.captureException(error);
    console.error('[service.getById] Database error:', error);
    return undefined;
  }
}

/**
 * Creates a new service. If a thumbnail is provided, it is uploaded to storage
 * and saved as `imageUrl`.
 */
export async function create(db: DbClient, input: z.infer<typeof CreateServiceSchema>) {
  try {
    const { thumbnail, ...serviceData } = input;

    const imageUrl = await handleImageUpload('services', thumbnail, input.slug, 'service');
    if (imageUrl) {
      serviceData.imageUrl = imageUrl;
    }

    const contentRendering = serviceData.content ? await markdownToHastJson(serviceData.content) : null;

    return db.insert(service).values({
      ...serviceData,
      contentRendering,
      contentRenderingVersion: RENDERING_VERSION,
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error('[service.create] Database error:', error);
    throw new InternalServerError('Failed to create service');
  }
}

/**
 * Updates a service. If a new thumbnail is provided, uploads it and deletes the old one.
 * Old image is only deleted after the new upload succeeds.
 */
export function update(db: DbClient, input: z.infer<typeof UpdateServiceSchema>) {
  return db.transaction(async (tx) => {
    try {
      const { thumbnail, id, ...serviceData } = input;

      if (thumbnail) {
        const existingService = await tx.query.service.findFirst({
          where: eq(service.id, id),
        });

        const imageUrl = await handleImageUpdate(
          'services',
          thumbnail,
          input.slug ?? id,
          existingService?.imageUrl,
          'service',
        );

        if (imageUrl) {
          serviceData.imageUrl = imageUrl;
        }
      }

      const setData: Record<string, unknown> = { ...serviceData };

      if (serviceData.content !== undefined) {
        setData.contentRendering = serviceData.content ? await markdownToHastJson(serviceData.content) : null;
        setData.contentRenderingVersion = RENDERING_VERSION;
      }

      return tx.update(service).set(setData).where(eq(service.id, id));
    } catch (error) {
      Sentry.captureException(error);
      console.error('[service.update] Database error:', error);
      throw new InternalServerError('Failed to update service');
    }
  });
}

/** Deletes a service and its associated image from storage if present. */
export function remove(db: DbClient, id: string) {
  return db.transaction(async (tx) => {
    try {
      const serviceToDelete = await tx.query.service.findFirst({
        where: eq(service.id, id),
      });

      if (!serviceToDelete) {
        throw new NotFoundError('Service not found');
      }

      await tx.delete(service).where(eq(service.id, id));

      if (serviceToDelete.imageUrl) {
        try {
          await deleteFile(serviceToDelete.imageUrl);
        } catch (error) {
          Sentry.captureException(error);
          console.error('[service.remove] Image deletion failed:', error);
        }
      }
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      Sentry.captureException(error);
      console.error('[service.remove] Database error:', error);
      throw new InternalServerError('Failed to delete service');
    }
  });
}
