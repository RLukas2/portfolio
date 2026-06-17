// biome-ignore lint/performance/noNamespaceImport: Sentry SDK requires namespace import
import * as Sentry from '@sentry/node';
import { del, put } from '@vercel/blob';
import { InternalServerError, ValidationError } from '@xbrk/errors';
import { createSlug, isValidBase64 } from './lib/validation';

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const allowedDomains = ['vercel-blob.com', 'blob.vercel-storage.com'];

/**
 * Uploads an image to Vercel Blob storage.
 * @param folder - The folder path in blob storage
 * @param image - Base64 encoded image string
 * @param slug - Slug for the filename (will be sanitized)
 * @returns The public URL of the uploaded image
 * @throws {Error} If validation fails or upload fails
 */
export async function uploadImage(folder: string, image: string, slug: string): Promise<string> {
  try {
    if (!image?.trim()) {
      throw new ValidationError('Invalid image: empty string provided');
    }

    if (!isValidBase64(image)) {
      throw new ValidationError('Invalid base64 format');
    }

    const imageSize = Buffer.byteLength(image, 'base64');
    if (imageSize > MAX_IMAGE_SIZE) {
      throw new ValidationError(
        `Image exceeds maximum allowed size of ${MAX_IMAGE_SIZE / 1024 / 1024}MB (got ${(imageSize / 1024 / 1024).toFixed(2)}MB)`,
      );
    }

    // Sanitize slug to ensure it's URL-safe
    const safeSlug = createSlug(slug);
    const fileName = `${safeSlug}-${Date.now()}.avif`;
    const imageBuffer = Buffer.from(image, 'base64');
    const path = `${folder}/${fileName}`;

    const { url } = await put(path, imageBuffer, {
      access: 'public',
      contentType: 'image/avif',
    });
    return url;
  } catch (_error) {
    Sentry.captureException(_error);
    throw new InternalServerError('Failed to upload image', { cause: _error as Error });
  }
}

/**
 * Deletes a file from Vercel Blob storage.
 * @param url - The URL of the file to delete
 * @throws {Error} If validation fails or deletion fails
 */
export async function deleteFile(url: string): Promise<void> {
  try {
    if (!url?.trim()) {
      throw new ValidationError('Invalid URL: empty string provided');
    }

    const urlObj = new URL(url);
    if (!allowedDomains.some((domain) => urlObj.hostname.includes(domain))) {
      throw new ValidationError('URL does not belong to an allowed storage domain');
    }

    await del(url);
  } catch (_error) {
    Sentry.captureException(_error);
    throw new InternalServerError('Failed to delete file', { cause: _error as Error });
  }
}
