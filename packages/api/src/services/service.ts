// biome-ignore lint/performance/noNamespaceImport: Sentry SDK requires namespace import
import * as Sentry from '@sentry/node';
import type { db as DB } from '@xbrk/db/client';
import { CreateServiceSchema, service, UpdateServiceSchema } from '@xbrk/db/schema';
import { desc, eq } from 'drizzle-orm';
import type { z } from 'zod/v4';
import { deleteFile, uploadImage } from '../storage';

type DbClient = typeof DB;

/** Returns all services including drafts. For admin use only. */
export function getAll(db: DbClient) {
  return db.query.service.findMany({
    orderBy: desc(service.id),
  });
}

/** Returns only published (non-draft) services. */
export function getAllPublic(db: DbClient) {
  return db.query.service.findMany({
    where: eq(service.isDraft, false),
  });
}

/**
 * Returns a single service by slug.
 * Draft services are only accessible to admins.
 * @throws {Error} If service not found or is a draft and requester is not admin.
 */
export async function getBySlug(db: DbClient, input: { slug: string }, session?: { user: { role: string } } | null) {
  const serviceResult = await db.query.service.findFirst({
    where: eq(service.slug, input.slug),
  });

  if (!serviceResult) {
    throw new Error('Service not found');
  }

  // if service is draft, throw an error unless user is admin
  if (serviceResult.isDraft && session?.user.role !== 'admin') {
    throw new Error('Service is not public');
  }

  return serviceResult;
}

/** Returns a single service by ID. Returns `undefined` if not found. */
export function getById(db: DbClient, input: { id: string }) {
  return db.query.service.findFirst({
    where: eq(service.id, input.id),
  });
}

/**
 * Creates a new service. If a thumbnail is provided, it is uploaded to storage
 * and saved as `imageUrl`.
 */
export async function create(db: DbClient, input: z.infer<typeof CreateServiceSchema>) {
  const { thumbnail, ...serviceData } = input;

  if (thumbnail) {
    try {
      const imageUrl = await uploadImage('projects', thumbnail, input.slug);
      serviceData.imageUrl = imageUrl;
    } catch (error) {
      Sentry.captureException(error);
    }
  }

  return db.insert(service).values(serviceData);
}

/**
 * Updates a service. If a new thumbnail is provided, uploads it and deletes the old one.
 * Old image is only deleted after the new upload succeeds.
 */
export async function update(db: DbClient, input: z.infer<typeof UpdateServiceSchema>) {
  const { thumbnail, id, ...serviceData } = input;

  if (thumbnail) {
    try {
      const existingService = await db.query.service.findFirst({
        where: eq(service.id, id),
      });
      const oldImageUrl = existingService?.imageUrl;

      const imageUrl = await uploadImage('services', thumbnail, input.slug ?? id);
      serviceData.imageUrl = imageUrl;

      if (oldImageUrl) {
        await deleteFile(oldImageUrl);
      }
    } catch (error) {
      Sentry.captureException(error);
    }
  }

  return db.update(service).set(serviceData).where(eq(service.id, id));
}

/** Deletes a service and its associated image from storage if present. */
export async function remove(db: DbClient, id: string) {
  const serviceToDelete = await db.query.service.findFirst({
    where: eq(service.id, id),
  });

  if (serviceToDelete?.imageUrl) {
    await deleteFile(serviceToDelete.imageUrl);
  }

  return db.delete(service).where(eq(service.id, id));
}
