// biome-ignore lint/performance/noNamespaceImport: Sentry SDK requires namespace import
import * as Sentry from '@sentry/node';
import type { db as DB } from '@xbrk/db/client';
import { CreateExperienceSchema, experience, UpdateExperienceSchema } from '@xbrk/db/schema';
import { desc, eq } from 'drizzle-orm';
import type { z } from 'zod/v4';
import { deleteFile, uploadImage } from '../storage';

type DbClient = typeof DB;

/** Returns all experiences including drafts. For admin use only. */
export function getAll(db: DbClient) {
  return db.query.experience.findMany({
    orderBy: desc(experience.id),
  });
}

/** Returns only published (non-draft) experiences. */
export function getAllPublic(db: DbClient) {
  return db.query.experience.findMany({
    orderBy: desc(experience.id),
    where: eq(experience.isDraft, false),
  });
}

/** Returns a single experience by ID. Returns `undefined` if not found. */
export function getById(db: DbClient, input: { id: string }) {
  return db.query.experience.findFirst({
    where: eq(experience.id, input.id),
  });
}

/**
 * Creates a new experience entry. Empty `startDate`/`endDate` strings are coerced to `null`.
 * If a thumbnail is provided, it is uploaded to storage and saved as `imageUrl`.
 */
export async function create(db: DbClient, input: z.infer<typeof CreateExperienceSchema>) {
  const { thumbnail, ...experienceData } = input;

  const dataToInsert = {
    ...experienceData,
    startDate: experienceData.startDate || null,
    endDate: experienceData.endDate || null,
  };

  if (thumbnail) {
    try {
      const imageUrl = await uploadImage('experiences', thumbnail, input.title);
      dataToInsert.imageUrl = imageUrl;
    } catch (error) {
      Sentry.captureException(error);
    }
  }

  return db.insert(experience).values(dataToInsert);
}

/**
 * Updates an experience entry. If a new thumbnail is provided, uploads it and deletes the old one.
 * Empty `startDate`/`endDate` strings are coerced to `null`.
 */
export async function update(db: DbClient, input: z.infer<typeof UpdateExperienceSchema>) {
  const { thumbnail, id, ...experienceData } = input;

  const dataToUpdate = {
    ...experienceData,
    startDate: experienceData.startDate || null,
    endDate: experienceData.endDate || null,
  };

  if (thumbnail) {
    try {
      const existingExperience = await db.query.experience.findFirst({
        where: eq(experience.id, id),
      });
      const oldImageUrl = existingExperience?.imageUrl;

      const imageUrl = await uploadImage('experiences', thumbnail, id);
      dataToUpdate.imageUrl = imageUrl;

      if (oldImageUrl) {
        await deleteFile(oldImageUrl);
      }
    } catch (error) {
      Sentry.captureException(error);
    }
  }

  return db.update(experience).set(dataToUpdate).where(eq(experience.id, id));
}

/** Deletes an experience entry and its associated image from storage if present. */
export async function remove(db: DbClient, id: string) {
  const experienceToDelete = await db.query.experience.findFirst({
    where: eq(experience.id, id),
  });

  if (experienceToDelete?.imageUrl) {
    await deleteFile(experienceToDelete.imageUrl);
  }

  return db.delete(experience).where(eq(experience.id, id));
}
