// biome-ignore lint/performance/noNamespaceImport: Sentry SDK requires namespace import
import * as Sentry from '@sentry/node';
import type { db as DB } from '@xbrk/db/client';
import { CreateExperienceSchema, experience, UpdateExperienceSchema } from '@xbrk/db/schema';
import { desc, eq } from 'drizzle-orm';
import type { z } from 'zod/v4';
import { handleImageUpdate, handleImageUpload } from '../lib/base-service';
import { createSlug } from '../lib/validation';
import { deleteFile } from '../storage';

type DbClient = typeof DB;

/** Returns all experiences including drafts. For admin use only. */
export async function getAll(db: DbClient) {
  try {
    return await db.query.experience.findMany({
      orderBy: desc(experience.id),
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error('[experience.getAll] Database error:', error);
    return [];
  }
}

/** Returns only published (non-draft) experiences. */
export async function getAllPublic(db: DbClient) {
  try {
    return await db.query.experience.findMany({
      orderBy: desc(experience.id),
      where: eq(experience.isDraft, false),
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error('[experience.getAllPublic] Database error:', error);
    return [];
  }
}

/** Returns a single experience by ID. */
export async function getById(db: DbClient, input: { id: string }) {
  try {
    return await db.query.experience.findFirst({
      where: eq(experience.id, input.id),
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error('[experience.getById] Database error:', error);
    return undefined;
  }
}

/**
 * Creates a new experience entry. Empty `startDate`/`endDate` strings are coerced to `null`.
 * If a thumbnail is provided, it is uploaded to storage and saved as `imageUrl`.
 */
export function create(db: DbClient, input: z.infer<typeof CreateExperienceSchema>) {
  return (async () => {
    try {
      const { thumbnail, ...experienceData } = input;

      // Create URL-safe slug from title
      const slug = createSlug(experienceData.title);

      const dataToInsert = {
        ...experienceData,
        startDate: experienceData.startDate || null,
        endDate: experienceData.endDate || null,
      };

      const imageUrl = await handleImageUpload('experiences', thumbnail, slug, 'experience');
      if (imageUrl) {
        dataToInsert.imageUrl = imageUrl;
      }

      const [created] = await db.insert(experience).values(dataToInsert).returning();
      return created;
    } catch (error) {
      Sentry.captureException(error);
      console.error('[experience.create] Error:', error);
      throw new Error('Failed to create experience');
    }
  })();
}

/**
 * Updates an experience entry. If a new thumbnail is provided, uploads it and deletes the old one.
 * Empty `startDate`/`endDate` strings are coerced to `null`.
 */
export function update(db: DbClient, input: z.infer<typeof UpdateExperienceSchema>) {
  return db.transaction(async (tx) => {
    try {
      const { thumbnail, id, ...experienceData } = input;

      // Create URL-safe slug from title if title is being updated
      const slug = experienceData.title ? createSlug(experienceData.title) : undefined;

      const dataToUpdate = {
        ...experienceData,
        startDate: experienceData.startDate || null,
        endDate: experienceData.endDate || null,
      };

      if (thumbnail) {
        const existingExperience = await tx.query.experience.findFirst({
          where: eq(experience.id, id),
        });

        const imageUrl = await handleImageUpdate(
          'experiences',
          thumbnail,
          slug ?? id,
          existingExperience?.imageUrl,
          'experience',
        );

        if (imageUrl) {
          dataToUpdate.imageUrl = imageUrl;
        }
      }

      const [updated] = await tx.update(experience).set(dataToUpdate).where(eq(experience.id, id)).returning();
      if (!updated) {
        throw new Error('Experience not found');
      }
      return updated;
    } catch (error) {
      Sentry.captureException(error);
      console.error('[experience.update] Error:', error);
      throw new Error('Failed to update experience');
    }
  });
}

/** Deletes an experience entry and its associated image from storage if present. */
export function remove(db: DbClient, id: string) {
  return db.transaction(async (tx) => {
    try {
      const experienceToDelete = await tx.query.experience.findFirst({
        where: eq(experience.id, id),
      });

      if (!experienceToDelete) {
        throw new Error('Experience not found');
      }

      await tx.delete(experience).where(eq(experience.id, id));

      if (experienceToDelete.imageUrl) {
        try {
          await deleteFile(experienceToDelete.imageUrl);
        } catch (error) {
          Sentry.captureException(error);
          console.error('[experience.remove] Image deletion failed:', error);
        }
      }
    } catch (error) {
      if (error instanceof Error && error.message === 'Experience not found') {
        throw error;
      }
      Sentry.captureException(error);
      console.error('[experience.remove] Error:', error);
      throw new Error('Failed to delete experience');
    }
  });
}
