import { CreateExperienceSchema, UpdateExperienceSchema } from '@xbrk/db/api-schemas';
import { experience } from '@xbrk/db/schema';
import { HttpError, InternalServerError, NotFoundError } from '@xbrk/errors';
import { generateSlug } from '@xbrk/utils';
import { desc, eq, sql } from 'drizzle-orm';
import type { z } from 'zod/v4';
import type { DbClient } from '../shared/db';
import { reportError } from '../shared/errors';
import { handleImageUpload } from '../shared/image-lifecycle';
import { deleteFile } from '../storage/blob-storage';

export async function getAll(db: DbClient) {
  try {
    return await db.query.experience.findMany({
      orderBy: desc(experience.id),
    });
  } catch (error) {
    reportError('experiences.getAll', error);
    return [];
  }
}

export async function getAllPublic(db: DbClient) {
  try {
    return await db.query.experience.findMany({
      orderBy: desc(experience.id),
      where: eq(experience.isDraft, false),
    });
  } catch (error) {
    reportError('experiences.getAllPublic', error);
    return [];
  }
}

export async function getById(db: DbClient, input: { id: string }) {
  try {
    const query = db.query.experience
      .findFirst({
        where: eq(experience.id, sql.placeholder('id')),
      })
      .prepare('get_experience_by_id');
    return await query.execute({ id: input.id });
  } catch (error) {
    reportError('experiences.getById', error);
    return undefined;
  }
}

export async function create(db: DbClient, input: z.infer<typeof CreateExperienceSchema>) {
  const { thumbnail, ...experienceData } = input;

  if (experienceData.isOnGoing && experienceData.endDate) {
    console.warn('[experiences.create] Ongoing experience received an endDate despite schema validation');
  }

  const slug = generateSlug(experienceData.title);

  const dataToInsert = {
    ...experienceData,
    startDate: experienceData.startDate || null,
    endDate: experienceData.endDate || null,
  };

  let uploadedUrl: string | undefined;
  const imageUrl = await handleImageUpload('experiences', thumbnail, slug, 'experience');
  if (imageUrl) {
    uploadedUrl = imageUrl;
    dataToInsert.imageUrl = imageUrl;
  }

  try {
    return await db.insert(experience).values(dataToInsert);
  } catch (error) {
    if (uploadedUrl) {
      try {
        await deleteFile(uploadedUrl);
      } catch {
        // cleanup orphan blob on insert failure
      }
    }
    reportError('experiences.create', error);
    throw new InternalServerError('Failed to create experience');
  }
}

export async function update(db: DbClient, input: z.infer<typeof UpdateExperienceSchema>) {
  try {
    const { thumbnail, id, ...experienceData } = input;

    const existingExperience = await db.query.experience.findFirst({
      where: eq(experience.id, id),
    });
    if (!existingExperience) {
      throw new NotFoundError('Experience not found');
    }

    if (experienceData.isOnGoing && experienceData.endDate) {
      console.warn('[experiences.update] Ongoing experience received an endDate despite schema validation');
    }

    const slug = experienceData.title ? generateSlug(experienceData.title) : undefined;

    const dataToUpdate = {
      ...experienceData,
      startDate: experienceData.startDate || null,
      endDate: experienceData.endDate || null,
    };

    let oldImageUrl: string | null | undefined;
    if (thumbnail) {
      oldImageUrl = existingExperience.imageUrl;

      const imageUrl = await handleImageUpload('experiences', thumbnail, slug ?? id, 'experience');

      if (imageUrl) {
        dataToUpdate.imageUrl = imageUrl;
      }
    }

    await db.update(experience).set(dataToUpdate).where(eq(experience.id, id));

    if (oldImageUrl) {
      try {
        await deleteFile(oldImageUrl);
      } catch (error) {
        reportError('experiences.update', error);
      }
    }
  } catch (error) {
    if (error instanceof HttpError || error instanceof NotFoundError) {
      throw error;
    }
    reportError('experiences.update', error);
    throw new InternalServerError('Failed to update experience');
  }
}

export async function remove(db: DbClient, id: string) {
  try {
    const experienceToDelete = await db.query.experience.findFirst({
      where: eq(experience.id, id),
    });

    if (!experienceToDelete) {
      throw new NotFoundError('Experience not found');
    }

    await db.delete(experience).where(eq(experience.id, id));

    if (experienceToDelete.imageUrl) {
      try {
        await deleteFile(experienceToDelete.imageUrl);
      } catch (error) {
        reportError('experiences.remove', error);
      }
    }
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    reportError('experiences.remove', error);
    throw new InternalServerError('Failed to delete experience');
  }
}
