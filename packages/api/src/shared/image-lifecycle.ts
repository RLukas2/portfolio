import { HttpError } from '@xbrk/errors';
import { uploadImage } from '../storage/blob-storage';
import { reportError } from './errors';

export async function handleImageUpload(
  folder: string,
  thumbnail: string | undefined,
  slug: string,
  entityName: string,
): Promise<string | undefined> {
  if (!thumbnail || typeof thumbnail !== 'string') {
    return undefined;
  }

  try {
    return await uploadImage(folder, thumbnail, slug);
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    reportError(`${entityName} Image upload failed`, error);
    return undefined;
  }
}
